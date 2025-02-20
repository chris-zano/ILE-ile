import { isValidObjectId } from 'mongoose';
import { AdminsDB, StudentsDB, CoursesDB, LecturersDB } from '../../utils/global/db.utils.js';
import * as utils from '../../controllers/admin/admin.utils.js';

const Admins = AdminsDB();
const Tutors = LecturersDB();
const Students = StudentsDB();


/**
 * Handles cases where the document is not found.
 * Logs a ReferenceError and renders an error page.
 * 
 * @param {Object} res - The response object.
 * @returns {Object} - The rendered error page.
 */
const handleDocumentIsNull = (res) => {
    utils.logError(new ReferenceError());
    return res.render('global/error', { error: "Unauthorised access", status: 403 });
}

/**
 * Handles caught errors by logging them and rendering the index page with a flush.
 * 
 * @param {Error} error - The caught error.
 * @param {Object} res - The response object.
 * @returns {Object} - The rendered index page.
 */
const handleCatchError = (error, res) => {
    utils.logError(error);
    return res.render("index", { flush: "true" });
}


/**
 * Middleware to verify an admin user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const verifyAdmin = async (req, res, next) => {
    const { id } = req.params;

    // Validate the provided ID
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    try {
        // Find the admin document by ID
        const matchedDocument = await Admins.findById(id);

        // Handle case where no document is found
        if (!matchedDocument) return handleDocumentIsNull(res);

        // Attach admin data to the request object
        req.adminData = {
            id: matchedDocument._id,
            adminId: matchedDocument.adminId,
            role: matchedDocument.role,
            firstname: matchedDocument.firstName,
            lastname: matchedDocument.lastName,
            faculty: matchedDocument.faculty,
            profilePicUrl: matchedDocument.profilePicUrl
        };

        // Proceed to the next middleware
        return next();

    } catch (error) {
        // Handle errors during the process
        return handleCatchError(error, res);
    }
}


/**
 * Middleware to verify a lecturer.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const verifyLecturer = async (req, res, next) => {
    const { id } = req.params;

    // Validate the provided ID
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    try {
        // Find the lecturer document by ID
        const matchedDocument = await Tutors.findById(id);

        // Handle case where no document is found
        if (!matchedDocument) return handleDocumentIsNull(res);

        // Attach lecturer data to the request object
        req.lecturerData = {
            id: matchedDocument._id,
            lecturerId: matchedDocument.lecturerId,
            firstname: matchedDocument.firstName,
            lastname: matchedDocument.lastName,
            faculty: matchedDocument.faculty,
            profilePicUrl: matchedDocument.profilePicUrl,
            assignedCourses: matchedDocument.assignedCourses
        }

        // Proceed to the next middleware
        return next();

    } catch (error) {
        // Handle errors during the process
        return handleCatchError(error, res);
    }
}

/**
 * Middleware to verify a student.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const verifyStudent = async (req, res, next) => {
    const { id } = req.params;

    // Validate the provided ID
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    try {
        // Find the student document by ID
        const matchedDocument = await Students.findById(id);

        // Handle case where no document is found
        if (!matchedDocument) return handleDocumentIsNull(res);

        // Attach student data to the request object
        req.studentData = {
            id: matchedDocument._id,
            studentId: matchedDocument.studentId,
            firstname: matchedDocument.firstName,
            lastname: matchedDocument.lastName,
            program: matchedDocument.program,
            level: matchedDocument.level,
            session: matchedDocument.session,
            faculty: matchedDocument.faculty,
            courses: matchedDocument.courses,
            registeredCourses: matchedDocument.registeredCourses,
            files: matchedDocument.files,
            repos: matchedDocument.repos,
            classId: matchedDocument.classId,
            profilePicUrl: matchedDocument.profilePicUrl
        }

        // Proceed to the next middleware
        return next();

    } catch (error) {
        // Handle errors during the process
        return handleCatchError(error, res);
    }
}

export const verifyUser = async (req, res, next) => {
    const usersToModelMatch = { "admin": Admins, "student": Students, "lecturer": Tutors };
    const { user, id } = req.params;

    try {
        const userDb = usersToModelMatch[user];
        if (!userDb) return res.status(403).json({ message: "Invalid user" });

        if (!id || !isValidObjectId(id)) return res.status(400).json({ message: "Invvalid object id" });

        const matchedDocument = await userDb.findById(id);

        if (!matchedDocument) return res.status(404).json({ message: "user not found" });

        req[`${user}Data`] = { id: matchedDocument._id };
        req.userObjectdata = matchedDocument;

        next();
    } catch (error) {
        return handleCatchError(error, res);
    }
}

/**
 * Checks if the username from a login attempt matches a valid username pattern for various user roles.
 * If the username is not provided, responds with 400 and an error message in JSON format.
 * If the username does not match any valid user pattern, responds with 403 indicating an unauthorized login attempt.
 * If the username matches one of the patterns, sets the corresponding format in the request object and calls the next middleware.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const checkUsernamePattern = (req, res, next) => {
    const { username } = req.body;

    // Check if the username is provided
    if (!username) {
        return res.status(400).json({ message: "Incorrect username" });
    }

    const regexMap = {
        admin: /^AD-\d{3}[A-Za-z0-9]*$/,
        tutor: /^TU-\d{3}[A-Za-z0-9]*$/,
        student: /^\d{10}$/
    };

    console.log(username, username.length)
    // Determine the username format using the regexMap
    const usernameFormat = Object.keys(regexMap).find(key => regexMap[key].test(username)) || "none";

    req.usernameformat = usernameFormat;

    // Check if the username format is valid
    if (req.usernameformat === "none") {
        return res.status(403).json({ message: "Unauthorised login" });
    }

    // Proceed to the next middleware
    return next();
};