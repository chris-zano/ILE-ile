const lecturersProperties = ['lecturerId', 'firstName', 'lastName', 'faculty', 'assignedCourses'];
const studentsproperties = ['studentId', 'firstName', 'lastName', 'program', 'year', 'level', 'faculty'];

const validateImportedJSON = (jsonObject = {}, properties = []) => {
    if (!Array.isArray(properties)) {
        throw new Error("Properties must be an array!");
    }

    const missingProperties = properties.filter((prop) => jsonObject.hasOwnProperty(prop));

    return (missingProperties.length === 0);
}

const handleUserImport = (req, res) => {
    const { userType, id, adminId, role } = req.query;
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', '..', 'models', 'imports', filename);
}