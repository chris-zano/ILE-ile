const adminId = JSON.parse(window.sessionStorage.getItem('auth-user')).data.id;

if (adminId === null) {
    alert("There was an error authenticating you.\nRedirecting to login ");
    window.location.replace("/login");
} else {
    console.info("User Authenticated");
}

const updateCourse = async (courseId) => {
    const url = `/admins/render/updates/course/${courseId}/${adminId}`;
    window.location.href = url;
}

const deleteCourse = async (courseId) => {
    const confirmState = confirm("Are you sure you want to delete this course?\nThis action is irreversible.");

    if (confirmState) {
        const url = `/admins/delete/course/${courseId}/${adminId}`;
        const request = await fetch(url);
        const response = await request.json();

        if (request.ok) {
            document.getElementById("courses-cards").innerHTML = "";
            await makeRequestForCourses();
        }
    }
    else {
        console.log("you cancelled course deleting")
    }
}

const courseCard = (course) => {
    const card = document.createElement('div');
    card.classList.add("card");
    // card.setAttribute("href", `/admins/render/updates/course/${course._id}/${adminId}`);
    card.innerHTML = `  
        <section class="card-body">
            <div class="thumbnail">
                <img src="/random/image"/>
            </div>
            <div class="title">
                <small>[${course.courseCode}]</small>
                <h2>${course.title}</h2>
                <div class="professor">
                    <img src="/images/system/user" alt="professor">
                    <p>${course.lecturer.name == "unassigned" ? "No lecturer assigned" : course.lecturer.name}</p>
                </div>
                <div class="footer">
                    <div class="highlight-footer h-level">
                        <small>Level: <span
                        class="${course.level === 100 ? 'one' : course.level === 200 ? 'two' : course.level === 300 ? 'three': 'four'}" 
                        >${course.level}</span></small>
                    </div>
                    <div class="highlight-footer">
                        <small>Enrolled: <span>${course.students.length}</span></small>
                    </div>
                </div>
            </div>
            <div class="actions">
                <button type="button" id="c-update-btn" onclick="updateCourse('${course._id}')" >Update</button>
                <button type="button" id="c-delete-btn" onclick="deleteCourse('${course._id}')">Delete</button>
            </div>
        </section>
    `;

    return card;
}

const renderCourseCards = (courses = []) => {
    if (courses.length !== 0) {
        for (let course of courses) {
            const card = courseCard(course);

            document.getElementById('courses-cards').append(card);
        }
    }

    return;
}

const makeRequestForCourses = async () => {
    const offset = 0;
    const query = { key: "default", value: "null" };

    const url = `/admin/courses/get-courses/${adminId.trim()}?key=${encodeURIComponent(query.key.trim())}&value=${encodeURIComponent(query.value.trim())}&offset=${encodeURIComponent(String(offset).trim())}`;

    //initial page load;
    const response = await fetchData(url);

    if (response) {
        if (response.status = 200 && response.data.courses.length !== 0) {
            window.sessionStorage.setItem("courses-data-cache", JSON.stringify({ courses: response.data.courses, timeStamp: new Date().getTime() }));
            renderCourseCards(response.data.courses);
        }
        else {
            const noAvailableCourseMessage = document.createElement("div");
            noAvailableCourseMessage.innerHTML = `
                <div>No courses available for your department</div>
                <div>Create a new course now.</div>
            `;

            document.getElementById('courses-cards').append(noAvailableCourseMessage);
        }
    }
}

const main = async () => {
    const coursesCache = JSON.parse(window.sessionStorage.getItem("courses-data-cache"));
    if (!coursesCache) {
        await makeRequestForCourses();
    }
    else {
        const courses = coursesCache.courses;
        const timeStamp = coursesCache.timeStamp;

        if ((new Date().getTime() - timeStamp) >= (10 * 1000)) {
            await makeRequestForCourses();
        }
        else {
            renderCourseCards(courses);
        }

    }
}


document.addEventListener("DOMContentLoaded", main);