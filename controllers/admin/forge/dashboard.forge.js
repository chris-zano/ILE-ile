const dashboardObjectdata = {
    courseAnalysis: '',
    studentAnalysis: '',
    lecturerAnalysis: '',
};

const runCourseAnalytics = (query={}) => {
    return 'course analytics called { yet to be implemented }';
}

const runStudentAnalytics = (query={}) => {
    return 'student analytics called { yet to be implemented }';
}

const runLecturerAnalytics = (query={}) => {
    return 'student analytics called { yet to be implemented }';
}

const getDashboardData = (req, res) => {
    dashboardObjectdata.courseAnalysis = runCourseAnalytics();
    dashboardObjectdata.studentAnalysis = runStudentAnalytics();
    dashboardObjectdata.lecturerAnalysis = runLecturerAnalytics();

    return {...dashboardObjectdata};
}

export default getDashboardData;