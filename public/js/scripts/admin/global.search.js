let searchTimer;

const mountcourses = (course) => {
    const heading = course.title;
    const subheading = course.courseCode;
    const li = document.createElement("li");
    li.classList.add("results-item");

    li.innerHTML = `
        <a href="#">
            <h2>${heading}</h2>
            <p>${subheading}</p>
        </a>
    `;

    document.getElementById("results-ul").append(li)

}
const mountstudents = (student) => {
    const heading = student.firstName + " "+ student.lastName;
    const subheading = student.studentId;
    const li = document.createElement("li");
    li.classList.add("results-item");

    li.innerHTML = `
        <a href="#">
            <h2>${heading}</h2>
            <p>${subheading}</p>
        </a>
    `;

    document.getElementById("results-ul").append(li)


}
const mounttutors = (tutor) => {
    const heading = tutor.firstName + " "+ tutor.lastName;
    const subheading = tutor.lecturerId;
    const li = document.createElement("li");
    li.classList.add("results-item");

    li.innerHTML = `
        <a href="#">
            <h2>${heading}</h2>
            <p>${subheading}</p>
        </a>
    `;

    document.getElementById("results-ul").append(li)
}
const mountmaterials = (material) => {
    const heading = material.originalname;
    const subheading = material.courseId;
    const li = document.createElement("li");
    li.classList.add("results-item");

    li.innerHTML = `
        <a href="#">
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
        case "materials":
            results.forEach(material => {
                mountmaterials(material);
            })
            break;
        default:
            break;
    }

    document.getElementById("search-matches").innerText = results.length == 1? results.length + " match found.": results.length + " matches found."
}
const handleSearch = () => {
    const socket = io();
    const category = document.getElementById("search-category").value;
    const searchInput = document.getElementById("search-input").value;

    if (category == "none") {
        toast("Please Choose a Category");
    }
    else if (searchInput == "") {
        //do nothing
        document.getElementById("search-results-div").classList.add("hidden");
        return;
    } 
    else {
        ("Search: ", searchInput);
        ("Category: ", category);

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
