const updateCourse = (query = {}, updateObject = {}) => {
    return 'update course called { yet to be implemented }';
}

const findCourse = (query = {}) => {
    return 'find course called { yet to be implemented }';
}

const deleteCourse = (query = {}) => {
    return 'delete course called { yet to be implemented }';
}

const courseActions = (req, res) => {
    const { action } = req.params;
    const actionMethods = { update: updateCourse, find: findCourse, delete: deleteCourse };

    const dataMethods = actionMethods[action];
    if (dataMethods) {
        console.log(dataMethods());
    }
}

module.exports = courseActions;