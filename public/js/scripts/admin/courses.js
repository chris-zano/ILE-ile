const adminId = JSON.parse(window.sessionStorage.getItem('auth-user')).data.id;

if (adminId === null) {
    alert("There was an error authenticating you.\nRedirecting to login ");
    window.location.replace("/login");
} else {
    console.info("User Authenticated");
}

const courseCard = (course) => {
    const card = document.createElement('a');
    card.classList.add("card");
    card.setAttribute("href", `/admins/render/updates/course/${course._id}/${adminId}`);
    card.innerHTML = `
        <section class="card-header">
            <img src="/images/system/ui" alt="course thumbnail" width="150px" height="150px">
        </section>
        <section class="card-body">
            <div class="title">
                <h2>${course.title}</h2>
                <small>${course.courseCode}</small>
            </div>
            <div class="professor">
                <img src="/images/system/lecturer" alt="professor">
                    <p>${course.lecturer.name == "unassigned" ? "No lecturer assigned" : course.lecturer.name}</p>
            </div>
            <div class="footer">
                <div class="highlight-footer">
                    <img src="/images/system/classrooms" alt="course level">
                    <small>${course.level}</small>
                </div>
                <div class="highlight-footer">
                    <img src="/images/system/students" alt="students count">
                    <small>${course.students.length}</small>
                </div>
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

        if ((new Date().getTime() - timeStamp) >= (60 * 1000)) {
            await makeRequestForCourses();
        }
        else {
            renderCourseCards(courses);
        }

    }
}


document.addEventListener("DOMContentLoaded", main);