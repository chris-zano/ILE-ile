let endDate = undefined;
let courses = undefined;
let startDate = undefined;
let coursesWithStudents = undefined;
let expectedSubmissions = undefined;
let currentCourseCode = null;

let userdata = window.sessionStorage.getItem('auth-user') || undefined;

if (!userdata) window.location.replace('/login');
else userdata = JSON.parse(userdata);

const downloadAll = (button) => {
    const collection = button.parentElement.parentElement.querySelectorAll('.dl-link');
    const files = [];

    if (Array.from(collection).length === 0) {
        Toast_Notification.showInfo("No files to download")
        return null
    };

    Array.from(collection).forEach(link => {
        const url = link.getAttribute('href');
        const name = link.getAttribute('download');

        files.push({ name, url });
    })

    let zip = new JSZip();
    let folder = zip.folder("downloads");

    let downloadPromises = files.map(function (file) {
        return fetch(file.url)
            .then(response => response.blob())
            .then(blob => {
                folder.file(file.name, blob);
            });
    });

    Promise.all(downloadPromises).then(function () {
        zip.generateAsync({ type: "blob" }).then(function (content) {
            let link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "all-files.zip";
            link.click();
        });
    });

}

const addNewQuiz = async () => {
    window.location.href = `/lecturers/render/create-quiz/${userdata.data.id}?code=${encodeURIComponent(currentCourseCode)}`;
}

const closeOverlay = () => {
    document.getElementById('studSub-overlay').querySelector('#collection-subs').innerHTML = ""
    document.getElementById('studSub-overlay').setAttribute('hidden', 'true')
}

const viewStudentSubmissions = async (courseCode, submissionId) => {
    document.getElementById('studSub-overlay').querySelector('#collection-subs').innerHTML = ""
    document.getElementById('studSub-overlay').removeAttribute('hidden')
    const submissions = await getSubmissionsForCourse(courseCode);
    const { studentSubmissions } = submissions;

    for (let sub of studentSubmissions) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("stud-submission");
        wrapper.id = `${sub._id}`;

        wrapper.innerHTML = `

            <div class="submission-file">
                <i class="file-icon">📄</i>
                <span class="file-name">${sub.filename}</span>
                <button class="view-submission-btn download-sub"><a href="${sub.fileUrl}" class="dl-link" download="${sub.filename}">Download</a></button>
            </div>
        `;

        document.getElementById('collection-subs').append(wrapper)
    }
}

const deleteStudentSubmissions = async (courseCode, submissionId) => {
    const url = `/submissions/delete/${courseCode}/${submissionId}/${userdata.data.id}`;

    try {
        const request = await fetch(url, { method: 'DELETE' })
        console.log(await request.json());
        return window.location.reload();
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getSubmissionsForCourse = async (courseCode) => {
    try {
        const request = await fetch(`/submissions/get/${courseCode}/${userdata.data.id}`);
        const response = await request.json();

        console.log(response);

        if (request.ok) return response.doc;
        return null
    } catch (error) {
        console.error(error);
        return null
    }
}

const renderQuizSubmissions = (data) => {
    const _docs = [...data];
    console.log(_docs)
    
    const submissionsDiv = document.getElementById('course-submissions');
    submissionsDiv.innerHTML = ''; // Clear previous submissions

    if(_docs.length === 0) {
        const submissionDiv = document.createElement('div');
        submissionDiv.className = 'submission';

        submissionDiv.innerHTML = `No Submissions for this course. Click Add New submission to add one`
        return submissionsDiv.appendChild(submissionDiv);
    }


    for (let doc of _docs) {
        const wrapper = document.createElement("details");
        wrapper.classList.add("quiz-sub");
        wrapper.id = `${doc._id}`;

        wrapper.innerHTML = `
            <summary>${doc.courseCode} <span><strong>Score: </strong>${doc.score}</span></summary>
            <div id="${doc.quiz_id}"></div>
        `;

        submissionsDiv.append(wrapper);
        let counter = 0
        for (let q of doc.responses) {
            const questions = document.createElement('div')
            questions.classList.add('question-single-span')
            counter++
            questions.innerHTML = `
                <p>${counter}. ${q.question.question}</p>
                <label><input type="radio" name="q${counter}" value="a" selected> a. ${q.question.options[0]}.</label><br>
                <label><input type="radio" name="q${counter}" value="b" selected> b. ${q.question.options[1]}</label><br>
                <label><input type="radio" name="q${counter}" value="c" selected> c. ${q.question.options[2]}</label><br>
                <label><input type="radio" name="q${counter}" value="d" selected> d. ${q.question.options[3]}</label><br>
                <div>Answer: ${q.answer} </div>
                <div>Expected: ${q.question.correctAnswer.toLowerCase()}</div>

            `;
           document.getElementById(`${doc.quiz_id}`).append(questions);
        }

    }
}

const showCourseSubmissions = async (courseCode) => {

    if (courseCode === "quiz") {
        //show quiz submissions
        const url = `/submissions/lecturers/get-quiz-all/?id=${userdata.data.id}`;
        try {
            const response = await fetch(encodeURI(url));
            const data = await response.json();

            renderQuizSubmissions(data);
        }catch(error){
            console.log(error)
        }

        return
    }

    currentCourseCode = courseCode;
    // Remove active class from all items
    document.querySelectorAll('.carousel-item').forEach(item => item.classList.remove('active'));

    // Add active class to clicked item
    document.querySelector(`[onclick="showCourseSubmissions('${courseCode}')"]`).classList.add('active');

    // Display submissions for the selected course
    const submissionsDiv = document.getElementById('course-submissions');
    submissionsDiv.innerHTML = ''; // Clear previous submissions

    // Fetch submissions data (this is just a placeholder; replace with actual data fetching)
    const submissions = await getSubmissionsForCourse(courseCode);

    if (!submissions || Object.keys(submissions).length === 0) {
        const submissionDiv = document.createElement('div');
        submissionDiv.className = 'submission';

        submissionDiv.innerHTML = `No Submissions for this course. Click Add New submission to add one`
        return submissionsDiv.appendChild(submissionDiv);
    }
    // Insert submissions into the div
    submissions['lecturerSubmission'].forEach(submission => {

        if (!submission.startDate) {
            return;
        }
        const submissionDiv = document.createElement('div');
        submissionDiv.className = 'submission';

        submissionDiv.innerHTML = `
            <div class="submission-header">
                <button class="view-submission-btn" onclick="viewStudentSubmissions('${courseCode}', '${submission._id}')">View Submissions</button>
                <button class="del-submission-btn"onclick="deleteStudentSubmissions('${courseCode}', '${submission._id}')"
                style="display: ${new Date().getTime() >= new Date(submission.endDate.date) ? 'none' : ''}"
                >Delete</button>
            </div>
            <div class="submission-details">
                <p><strong>Title:</strong> ${submission.title}</p>
                <p><strong>Instructions:</strong> ${submission.instructions}</p>
                <p><strong>Release Date:</strong> ${formatTimestamp(submission.startDate.date)}</p>
                <p><strong>Due Date:</strong> ${formatTimestamp(submission.endDate.date)}</p>
                <p class="status ${new Date().getTime() >= new Date(submission.endDate.date) ? 'overdue' : 'pending'}">${new Date().getTime() >= new Date(submission.endDate.date) ? 'Ended' : 'Ongoing'}</p>
            </div>
        `;
        submissionsDiv.appendChild(submissionDiv);
    });
}

function getStartDate(value) {
    const now = new Date();
    switch (parseInt(value, 10)) {
        case 0: // Today
            startDate = now;
            break;
        case 1: // Tomorrow, 6:00
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 6, 0, 0);
            break;
        case 2: // In two days, 6:00
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 6, 0, 0);
            break;
        default:
            startDate = undefined;
    }
    return startDate;
}

function getEndDate(value) {
    const now = new Date();

    switch (parseInt(value, 10)) {
        case 0: // Tomorrow, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 0);
            break;
        case 1: // In two days, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 23, 59, 0);
            break;
        case 2: // In one week, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 0);
            break;
        case 3: // In two weeks, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59, 0);
            break;
        case 4: // In three weeks, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21, 23, 59, 0);
            break;
        case 5: // In one month, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), 23, 59, 0);
            break;
        case 6: // In two months, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate(), 23, 59, 0);
            break;
        case 7: // In three months, 11:59pm
            endDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate(), 23, 59, 0);
            break;
        default:
            endDate = undefined;
    }
    return endDate;
}

function convertToMilliseconds(date) {
    return date.getTime();
}


const showAddFile = () => {
    document.getElementById("submission-file").parentElement.classList.remove('hidden')
}

/**
 * This create the carousel for navigating through different course submissions
 * @param {Array} courses - collection of course objects
 */
const createCarousel = (courses) => {
    const carousel = document.getElementById("carousel-inner");
    courses.forEach((c, index) => {
        const div = document.createElement("div")
        if (index === 0) {
            div.innerHTML = `<div class="carousel-item active" onclick="showCourseSubmissions('${c.courseCode}')">${c.courseCode}</div>`
        } else {
            div.innerHTML = `<div class="carousel-item" onclick="showCourseSubmissions('${c.courseCode}')">${c.courseCode}</div>`
        }
        carousel.append(div);
    });

    carousel.querySelector('.active').click();
}

const addNewSubmission = (button) => {
    document.querySelector('form').reset();
    document.getElementById("form-wrapper").style.position = 'fixed';
    document.getElementById("form-wrapper").classList.remove('hidden');

    const coursesSelect = document.getElementById('course_code');
    for (let c of coursesWithStudents) {
        console.log('c: ', c);
        const opt = document.createElement('option');
        opt.value = `${c.courseCode}`;
        opt.textContent = `${(c['courseCode'])} - ${c['title']}`;
        coursesSelect.appendChild(opt);
    }

    document.getElementById('start-date').addEventListener('change', function () {
        startDate = getStartDate(this.value);
    });

    document.getElementById('end-date').addEventListener('change', function () {
        endDate = getEndDate(this.value);
    });

    document.getElementById('course_code').addEventListener('change', function () {
        const selectedCourse = coursesWithStudents.find(c => c.courseCode === this.value);
        expectedSubmissions = selectedCourse ? selectedCourse.students.length : 0;
    });

    document.getElementById('post-submission-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!startDate || !endDate) {
            alert('You have to set a START and END date for this submission');
            document.querySelector('input#cancel-btn').click();
            return
        }
        if (convertToMilliseconds(startDate) >= convertToMilliseconds(endDate)) {
            alert('END date cannot come before START date');
            document.querySelector('input#cancel-btn').click();
            return;
        }

        const courseCode = document.getElementById('course_code').value;
        const title = document.getElementById('title').value;
        const instructions = document.getElementById('instructions').value;
        const start_date = startDate;
        const end_date = endDate;
        const submissionObject = {
            courseCode: courseCode,
            title: title,
            instructions: instructions,
            startDate: {
                date: start_date,
                timeStamp: convertToMilliseconds(start_date)
            },
            endDate: {
                date: end_date,
                timeStamp: convertToMilliseconds(end_date)
            },
            expected: expectedSubmissions,
            received: 0,
            fileUrl: {}
        };

        for (let key of Object.keys(submissionObject)) {
            if (submissionObject[key] === undefined || submissionObject[key] === 'none') {
                alert(`You have an invalid input for ${key} - ${submissionObject[key]}. Resetting form`);
                document.querySelector('input#cancel-btn').click();
                return;
            }
        }

        const lectId = document.getElementById('lect-id').getAttribute('data-lect-id') || null;

        if (lectId === null) {
            alert('An error occured while validating your session!')
            document.querySelector('input#cancel-btn').click();
            return;
        }
        let url = null;

        const noFile = noFileUploaded();
        if (noFile) {
            url = `/submissions/create/${lectId}`;

            try {
                const request = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submissionObject) });
                const response = await request.json();

                console.log(response);
                document.querySelector('input#cancel-btn').click();
                location.reload();
            } catch (error) {
                console.error(error);
            }

        }
        else if (noFile === null) {
            document.querySelector('input#cancel-btn').click();
        }
        else {
            document.getElementById("expectedSubmissions").value = expectedSubmissions;
            url = `/submissions/create-with-file/${lectId}`
            event.target.setAttribute('action', encodeURI(url));
            event.target.submit();
        }
    })
}

const cancelSubmitForm = () => {
    document.getElementById("form-wrapper").style.position = 'unset';
    document.getElementById("form-wrapper").classList.add('hidden');
    document.querySelector('form').reset();
    startDate = undefined;
    endDate = undefined;
    const defaultOption = document.createElement('option');
    defaultOption.value = 'none';
    defaultOption.textContent = '----Select a Course----';

    document.getElementById('course_code').innerHTML = '';
    document.getElementById('course_code').appendChild(defaultOption)
}

const noFileUploaded = () => {
    const fileForm = document.getElementById('submission-file');
    const fileLength = fileForm.files.length;

    if (fileLength === 0) {
        return true;
    }

    if (fileLength === 1) {
        return false;
    }

    alert('You can only upload one (1) file per submission!');
    return null
}

const submissionsMain = async () => {
    try {
        courses = JSON.parse(document.getElementById("assigned-courses-hide").textContent).courses;
        document.getElementById("assigned-courses-hide").innerHTML = "";
        document.getElementById("assigned-courses-hide").style.display = 'none';

        if (!courses) {
            courses = undefined;
            throw new Error("courses is undefined or null");
        }
    } catch (error) {
        console.error(error);
    }
    finally {
        console.log(courses);
    }

    if (!courses) return;

    //create carousel
    coursesWithStudents = courses.filter(c => c.students.length > 0);
    const coursesWithoutStudents = courses.filter(c => c.students.length === 0);

    createCarousel(coursesWithStudents);
}

document.addEventListener('DOMContentLoaded', submissionsMain);