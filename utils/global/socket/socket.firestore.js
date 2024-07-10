import { RTCDB } from "../db.utils.js";
import { watchRtcCollection } from "./socket.rtc.utils.js";

const db = RTCDB();
/**
 * store
 * read
 * delete
 * add event listener
 */

export const getOrCreateRoom = async (socket, classId, hostId) => {
    try {
        console.log({ classId, hostId })
        const doc = await db.findOne({ classId: classId });
        let roomData = null
        if (!doc) {
            const newRoom = new db({ classId: classId, hostId: hostId });
            roomData = await newRoom.save();
        }
        else {
            roomData = doc;
        }
        console.log(roomData);
        return socket.emit("roomRef", roomData);
    } catch (error) {
        console.log(error);
    }
}

export const getMeetingRoom = async (roomId, hostId) => {
    try {
        console.log({ roomId, hostId })
        const doc = await db.findOne({ _id: roomId });
        let roomData = null
        if (doc !== null) {
            roomData = doc;
        }
        console.log(roomData);
        return socket.emit("sendMeetingRoom", roomData);
    } catch (error) {
        console.log(error);
    }
}
export const updateRTCDocument = async (socket, roomref) => {
    try {
        const _filter = { _id: roomref._id, hostId: roomref.hostId, classId: roomref.classId, __v: roomref.__v };
        const _replacement = { ...roomref };
        const _options = { new: true };

        await db.findOneAndReplace(_filter, _replacement, _options);
        const updatedDoc = await db.findOneAndUpdate(_filter, { $inc: { __v: 1 } }, _options);

        return socket.emit('updatedRTCDocument', updatedDoc);
    } catch (error) {
        console.log(error);
    }
}

export const createRoomWithOffer = async (socket, roomWithOffer, roomref) => {
    try {
        const _filter = { _id: roomref._id, hostId: roomref.hostId, classId: roomref.classId, __v: roomref.__v };
        const _options = { new: true };

        const updatedDoc = await db.findOneAndUpdate(_filter, { $set: { roomWithOffer: roomWithOffer } }, _options);
        console.log(updatedDoc);
        return socket.emit('createdRoom', updatedDoc);
    } catch (error) {
        console.log(error);
    }
};

export const addDatabaseListener = async (socket, roomref, property) => {
    try {
        const doc = await watchRtcCollection(db)
        socket.emit("changeEventOccured", doc)
    } catch (error) {
        console.log(error)
    }
}