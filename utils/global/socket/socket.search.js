import { findCourse, findMaterial, findStudent, findTutor } from "../../../controllers/admin/admin.search.js";

const handleSearch = (category, searchInput) => {
    if (category == "courses") {
        findCourse(socket, searchInput)
    }

    switch (category) {
        case "courses":
            findCourse(searchInput);
            break;
        case "students":
            findStudent(searchInput);
            break;
        case "lecturers":
            findTutor(searchInput);
            break;
        case "materials":
            findMaterial(searchInput);
            break;
        default:
            break;
    }
}

export default handleSearch;