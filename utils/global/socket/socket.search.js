import { findCourse, findStudent, findTutor } from "../../../controllers/admin/admin.search.js";

const handleSearch = (category, searchInput) => {
    const searchFunctions = {
        'courses': findCourse,
        'students': findStudent,
        'lecturers': findTutor,
    }
    switch (category) {
        case "courses":
            findCourse(socket,searchInput);
            break;
        case "students":
            findStudent(socket,searchInput);
            break;
        case "lecturers":
            findTutor(socket,searchInput);
            break;
        default:
            break;
    }
}

export default handleSearch;