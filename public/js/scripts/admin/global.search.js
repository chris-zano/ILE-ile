
let searchTimer;
let user = sessionStorage.getItem('auth-user');

let user_id = user ? JSON.parse(user).data.id : undefined;
if (!user_id) window.location.replace('/login');
const userType = JSON.parse(user).user

const mountcourses = (course) => {
    const heading = course.title;
    const subheading = course.courseCode;
    const courseId = course._id;
    const li = document.createElement("li");
    li.classList.add("results-item");


    
    const url = userType === "admin"
     ?`/admins/render/updates/course/${courseId}/${user_id}`
     : `/${userType}s/render/course/${courseId}/${user_id}`

    li.innerHTML = `
        <a href="${url}">
            <h2>${heading}</h2>
            <p>${subheading}</p>
        </a>
    `;

    document.getElementById("results-ul").append(li)

}
const mountstudents = (student) => {
    const heading = student.firstName + " " + student.lastName;
    const subheading = student.studentId;
    const student_id = student._id
    const li = document.createElement("li");
    li.classList.add("results-item");

    li.innerHTML = `
        <a href="/admins/render/profile/student/${student_id}/${user_id}">
            <h2>${heading}</h2>
            <p>${subheading}</p>
        </a>
    `;

    document.getElementById("results-ul").append(li)


}
const mounttutors = (tutor) => {
    const heading = tutor.firstName + " " + tutor.lastName;
    const subheading = tutor.lecturerId;
    const tutor_id = tutor._id;
    const li = document.createElement("li");
    li.classList.add("results-item");

    li.innerHTML = `
        <a href="/admins/render/profile/tutor/${tutor_id}/${user_id}">
            <h2>${heading}</h2>
            <p>${subheading}</p>
        </a>
    `;

    document.getElementById("results-ul").append(li)
}

const renderSearchResults = (searchResults) => {
    const resultsType = searchResults.type;
    const results = searchResults.results;

    const searchResultsDiv = document.getElementById("search-results-div");
    searchResultsDiv.classList.remove("hidden");

    searchResultsDiv.querySelector("#results-ul").innerHTML = '';


    switch (resultsType) {
        case "courses":
            results.forEach(course => {
                mountcourses(course);
            });
            break;
        case "students":
            results.forEach(student => {
                mountstudents(student);
            })
            break;
        case "tutors":
            results.forEach(tutor => {
                mounttutors(tutor)
            })
            break;
        default:
            break;
    }

    document.getElementById("search-matches").innerText = results.length == 1 ? results.length + " match found." : results.length + " matches found."
}
const handleSearch = () => {
    const socket = io();
    const category = document.getElementById("search-category").value;
    const searchInput = document.getElementById("search-input").value;

    if (category == "none") {
        Toast_Notification.showInfo('Please choose a category')
    }
    else if (searchInput == "") {
        //do nothing
        document.getElementById("search-results-div").classList.add("hidden");
        return;
    }
    else {
        socket.emit('search', { category, searchInput });
        socket.on('searchResults', (searchResults) => {
            renderSearchResults(searchResults);
            socket.disconnect();
        });
    }
};
const resetTimer = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(handleSearch, 500);
};
const handleInputChange = () => {
    resetTimer();
};
document.getElementById("search-input").addEventListener('input', handleInputChange);
document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch();
})