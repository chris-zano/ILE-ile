import adminModels from '../../models/admin/admin.models.js';
import lecturerModel from '../../models/lecturer/lecturer.model.js';
import studentModel from '../../models/student/student.model.js';
import classesModel from '../../models/student/classes.model.js';
import coursesModel from '../../models/courses/courses.model.js';
import registrationModel from '../../models/courses/registration.model.js';
import rtcModel from '../../models/rtc/rtc.model.js';

export const AdminsDB = () => adminModels;
export const LecturersDB = () => lecturerModel;
export const StudentsDB = () => studentModel;
export const ClassesDB = () => classesModel;
export const CoursesDB = () => coursesModel;
export const RegisteredCoursesDB = () => registrationModel;
export const RTCDB = () => rtcModel;