let studentData;

try {
    studentData = window.sessionStorage.getItem("auth-user") || undefined;
    if (!studentData) submissionsMain(false)

    studentData = JSON.parse(studentData);
} catch (error) {
    console.log(error)
    submissionsMain(false);
}


const showSubmissions = async (button,courseId) => {
    button.parentElement.querySelector('.active').classList.remove('active');
    button.classList.add('active')
    if (courseId === "all") {
        console.log('showing all courses');
        //showAllSubmissions()
    }
}

const filterSubmissions = async (button, filterId) => {
    button.parentElement.querySelector('.active').classList.remove('active');
    button.classList.add('active')
    console.log(button)
    console.log(filterId)
}

const submissionsMain = (studentAuth = true) => {
    if (!studentAuth) return window.location.replace('/login');

    console.log("hello submissions");
    console.log(`This student data is, `, studentData)
}

document.addEventListener("DOMContentLoaded", submissionsMain);