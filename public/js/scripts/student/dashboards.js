const userData = sessionStorage.getItem('auth-user') ? JSON.parse(sessionStorage.getItem('auth-user')) : null;

if (!userData) {
    window.location.replace('/login');
}

const uniqueId = userData.data.id;
const studentId = userData.data.studentId;
const firstName = userData.data.firstName;
const courseCodes = userData.data.courses;
const classId = userData.data.classId;

const eventsContainer = document.getElementById('events-list');
const coursesList = document.getElementById('courses-list');
const submissionsList = document.getElementById('submissions-list');
const quizList = document.getElementById('quiz-list');

let submissions = null;
let schedule = null;
let quizzes = null;

const mountLoader = (element) => {
    const loader = new LoadingSpinner(element);
    loader.show();

    return loader;
}

const unmountLoader = (loader) => {
    loader.hide();
    return loader;
}

const formatDateAndTime = (date) => {
    const eventDate = new Date(date);

    const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return {
        date: formattedDate,
        time: formattedTime
    }
}

const renderEvents = (data) => {
    eventsContainer.innerHTML = "";
    if (data.length === 0) {
        eventsContainer.innerHTML = "No Upcoming Events"
    }

    Array.from(data).forEach(event => {
        const {date, time} = formatDateAndTime(event.eventDate);
        const formattedDateTime = `Date: ${event.day}, ${date} | Time: ${time}`;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Live Learning Session:</strong> ${event.course.title}<br>
            ${formattedDateTime};
        `
        eventsContainer.append(li);
    })
}

const renderCourses = (data) => {
    coursesList.innerHTML = "";
    if (data.length === 0) {
        return coursesList.innerHTML = "No available Courses data";
    }

    Array.from(data).forEach(course => {
        const li = document.createElement('li');
        li.innerHTML = `
        <strong>Course Title: </strong>${course.title}<br>
        Enrolled Students: ${course.students.length}
        `;

        coursesList.append(li);
    })
}

const renderSubmissions = (data) => {
    submissionsList.innerHTML = "";
    const submissions = data.totalSubmissionsAvailable;
    if (submissions.length === 0) {
        return submissionsList.innerHTML = "No submissions available";
    }
    const totalSubmissionsMade = data.totalSubmissionsMade;
    const totalSubmissionsAvailable = submissions.length;
    document.getElementById('totalSubmissionsMade').innerText = `${totalSubmissionsMade} / ${totalSubmissionsAvailable}`;

    Array.from(submissions).forEach(sub => {
        const {date: startDate, time: startTime} = formatDateAndTime(sub.startDate.date);
        const {date: endDate, time: endTime} = formatDateAndTime(sub.endDate.date);
        const status = sub.submitted ? 'Submitted' : 'Not Submitted';

        const li = document.createElement('li');
        li.innerHTML = `
            Assignment: <strong>${sub.title}</strong> <br>
            Start: <strong>${startDate + ' '+ startTime}</strong><br>
            End: <strong>${endDate + ' '+ endTime}</strong><br>
            Status:<span style="color: ${sub.submitted ? 'green' : 'red'}">${status}</span>
        `;

        submissionsList.append(li);

    })
}

const renderQuiz = (data) => {
    quizList.innerHTML = "";
    if (data.length === 0) {
        quizList.innerHTML = "No available Quiz data";
        
    }
    quizList.innerHTML = "No available Quiz data";
}


const renderData = (data, data_type) => {
    switch (data_type) {
        case 'events':
            renderEvents(data);
            break;
        case 'courses':
            renderCourses(data);
            break;
        case 'submissions':
            renderSubmissions(data);
            break;
        case 'quiz':
            renderQuiz(data);
            break;
        default:
            break;
    }
}

const getData = async (loader, data_type) => {
    const url = `/dashboard/get-student-data`;
    const headers = {
        "Content-Type": "application/json",
        "std-uid": `${uniqueId}`,
        'x-class-id': `${classId}`,
        "x-data-type": `${data_type}`
    }
    try {
        const response = await fetch(url, { headers: headers });
        const data = await response.json();
        const status = response.status;

        if (status === 200) {
            renderData(data, data_type);
            unmountLoader(loader);
        }

    } catch (error) {
        console.log(error);
        throw new Error(`Failed to get student's events data`);
    }
}
const dashboardsMain = async () => {

    const eventsLoader = mountLoader(eventsContainer);
    const coursesLoader = mountLoader(coursesList);
    const submissionsLoader = mountLoader(submissionsList);
    const quizLoader = mountLoader(quizList);

    try {
        const asynMethods = [
            getData(eventsLoader, 'events'),
            getData(coursesLoader, 'courses'),
            getData(submissionsLoader, 'submissions'),
            getData(quizLoader, 'quiz')
        ];

        const resolvedMethods = await Promise.all(asynMethods);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    } finally {

        unmountLoader(eventsLoader);
        unmountLoader(coursesLoader);
        unmountLoader(submissionsLoader);
        unmountLoader(quizLoader);
    }
};

document.addEventListener('DOMContentLoaded', dashboardsMain);