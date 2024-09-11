const userData = sessionStorage.getItem('auth-user') ? JSON.parse(sessionStorage.getItem('auth-user')) : null;

if (!userData) {
    window.location.replace('/login');
}

const uniqueId = userData.data.id;
const lecturerId = userData.data.lecturerId;
const firstName = userData.data.firstname;
const classId = userData.data.classId;

const eventsContainer = document.getElementById('events-list');
const coursesList = document.getElementById('courses-list');

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
        //No upcoming events
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
        // No Courses
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

const renderData = (data, data_type) => {
    switch (data_type) {
        case 'events':
            renderEvents(data);
            break;
        case 'courses':
            renderCourses(data);
            break;
        default:
            break;
    }
}

const getData = async (loader, data_type) => {
    const url = `/dashboard/get-lecturer-data`;
    const headers = {
        "Content-Type": "application/json",
        "std-uid": `${uniqueId}`,
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

    try {
        const asynMethods = [
            getData(eventsLoader, 'events'),
            getData(coursesLoader, 'courses')
        ];

        const resolvedMethods = await Promise.all(asynMethods);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    } finally {

        unmountLoader(eventsLoader);
        unmountLoader(coursesLoader);
    }
};

document.addEventListener('DOMContentLoaded', dashboardsMain);