import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { callInitFirebase } from "../../../requireStack.js"

/**
 * store
 * read
 * delete
 * add event listener
 */
export const storeData = async (socket, dataToStore) => {
    const firestoreDB = callInitFirebase();
    const genericCollection = collection(firestoreDB, "generics");
    const docref = await addDoc(genericCollection, {
        data: "generic data" + dataToStore
    });
    console.log("Document written with id: ", docref.id);
    socket.emit("firebase-store-complete", { docref });
}

export const getRoomRef = async (socket, classId) => {
    const fireStoreDB = callInitFirebase();
    const roomQuery = query(collection(fireStoreDB, "rooms"), where("classId", "==", classId));
    const roomSnapshot = await getDocs(roomQuery);
    let roomData = null
    if (roomSnapshot.empty) {
        console.log("No room found with classId: ", classId);
        const newRoomRef = await addDoc(collection(fireStoreDB, "rooms"), { classId: classId });
        roomData = { new: true, doc: newRoomRef.data() };
    }
    else {
        console.log("A room as found with the classId: ", classId);
        roomData = { new: false, doc: roomSnapshot.docs[0].data() };
    }

    return socket.emit("roomRef", roomData);
}

export const createRoomWithOffer = async (socket, roomWithOffer, classId) => {
    const fireStoreDB = callInitFirebase();
  
    console.log({roomWithOffer, classId})

    const roomQuery = query(collection(fireStoreDB, "rooms"), where("classId", "==", classId));
  

    const roomSnapshot = await getDocs(roomQuery);
  
    if (roomSnapshot.empty) {
      console.log("No room found with classId:", classId);
    
      return; 
    }
  

    const roomRef = roomSnapshot.docs[0].ref;
    await updateDoc(roomRef, {
      roomWithOffer
    }, { merge: true });
  
    const updatedRoomDoc = await getDoc(roomRef);
    const updatedRoomData = updatedRoomDoc.data();
    return socket.emit("createdRoom", updatedRoomData); 
  };