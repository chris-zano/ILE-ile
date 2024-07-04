import adminModels from '../../models/admin/admin.models';
import lecturerModel from '../../models/lecturer/lecturer.model';
import studentModel from '../../models/student/student.model';
import classesModel from '../../models/student/classes.model';
import coursesModel from '../../models/courses/courses.model';

export const AdminsDB = () => adminModels;
export const LecturersDB = () => lecturerModel;
export const StudentsDB = () => studentModel;
export const ClassesDB = () => classesModel;
export const CoursesDB = () => coursesModel;