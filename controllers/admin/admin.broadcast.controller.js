import { AdminsDB, AnnouncementsDB } from "../../utils/global/db.utils.js";
import { logError } from "./admin.utils.js";

const Admin = AdminsDB();
const Announcement = AnnouncementsDB();

export const createNewAnnouncement = async (req, res) => {
    if (!req.query || Object.keys(req.query).length === 0) {
        return res.status(400).redirect('/login');
    }

    if (!req.body || Object.keys(req.body).length < 5) {
        return res.status(400).redirect('/login');
    }

    const { id } = req.query;
    const { files } = req;
    const { title, date, greetings, content, closing } = req.body

    try {
        if (files.length === 0) {
            console.log('no files uploaded with data');
        }
        else {
            console.log(files)
        }
        const getGroup = { "Dear Students,": 'students', "Dear Tutors,": 'tutors', "Dear All,": 'all' }
        const document = await Admin.findOne({ _id: id }, { firstName: 1, lastName: 1, _id: 0 });
        if (!document) {
            return res.status(404).redirect('/login');
        }

        const userName = `${document.firstName} ${document.lastName}`;
        let announce_to = getGroup[greetings] || null;
        if (!announce_to) announce_to = 'all';

        const announcement = { title, date, greetings, content, closing, userName, files , to: announce_to};
        const newAnnouncement = new Announcement(announcement);
        await newAnnouncement.save();

        return res.status(200).redirect(`/admins/render/announcements/${id}`);
    } catch (error) {
        logError(error);
        return res.status(500).redirect(`/admins/render/announcements/${id}`);
    }
}