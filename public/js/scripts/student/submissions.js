let studentData;
let activeTab;

try {
    studentData = window.sessionStorage.getItem("auth-user") || undefined;
    if (!studentData) submissionsMain(false);

    studentData = JSON.parse(studentData);
} catch (error) {
    console.log(error)
    submissionsMain(false).catch(console.error);
}

const submissionsCollection = JSON.parse(document.getElementById("data-files").textContent)
document.getElementById("data-files").innerHTML = "";
document.getElementById("data-files").textContent = "";
document.getElementById("data-files").style.zIndex = "-9999";
document.getElementById("data-files").style.display = "none";

let currentCollectionSet = [];

const container = document.getElementById("submission-body");
container.innerHTML = ""

const cancelSubmitForm = () => {
    const formWrapper = document.getElementById("form-wrapper");
    if (formWrapper) {
        formWrapper.remove();  // This will remove the form-wrapper div and its contents
    }
}

const renderAddSubmissionModal = (subId, lectSubId) => {
    const form_container = document.createElement("div");
    form_container.classList.add('form-wrapper');
    form_container.id = 'form-wrapper';

    const form = document.createElement("div");
    form.classList.add('form-inner');
    form.innerHTML = `
      <form
        action="/submissions/student/add/${studentData.data.id}?subId=${subId}&lectSubId=${lectSubId}"
        method="post"
        id="post-submission-form"
        enctype="multipart/form-data"
        >
        <div class="input-wrap">
          <label for="submission-file">Upload File</label>
          <input type="file" name="submission-file" id="submission-file"  required/>
        </div>
        <div class="buttons-action-wrap">
          <input type="submit" value="Submit" id="submit-btn" />
          <input
            type="reset"
            value="Cancel"
            onclick="cancelSubmitForm()"
            id="cancel-btn"
          />
        </div>
      </form>
    `;

    form_container.appendChild(form);
    document.getElementById("student-submissions_main").append(form_container);
}

const studentHasSubmission = (submissionId, subId, studentId) => {
    try {
        const submission = submissionsCollection.find(sub => sub._id === submissionId);
        if (!submission) return false;

        const studentSubmission = submission.studentSubmissions.find(s => s.subId === subId && s.id === studentId);
        return !!studentSubmission;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getstudentSubmission = (submissionId, subId, studentId) => {
    try {
        const submission = submissionsCollection.find(sub => sub._id === submissionId);
        if (!submission) return false;

        const studentSubmission = submission.studentSubmissions.filter(s => s.subId === subId && s.id === studentId);
        return studentSubmission[0];
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getLecturerName = async (id, subId) => {
    const url = `/submissions/lecturer/name/${id}/${subId}`;
    const req = await fetch(url);
    const res = await req.json();

    if (req.ok) {
        return `${res.doc.firstName} ${res.doc.lastName}`;
    }

    return null;
}

const renderSubmissionsByCourse = async (submissions = []) => {
    currentCollectionSet = [...submissions]
    if (submissions.length === 0) {
        container.innerHTML = `
        <div class="no-available-courses" style="display: grid; place-items: center;">
        <p>There are no available submissions for this course.</p>
        </div>
        `;
    }
    for (let courseSubmission of submissions) {
        for (let lectSub of courseSubmission.lecturerSubmission) {
            const isSubmitted = studentHasSubmission(courseSubmission._id, lectSub._id, studentData.data.id);
            const studentSub = getstudentSubmission(courseSubmission._id, lectSub._id, studentData.data.id);
            const lectName = await getLecturerName(courseSubmission.lecturer, courseSubmission._id)

            //create wrapper
            const wrapper = document.createElement("div");
            wrapper.classList.add("submission");
            wrapper.id = courseSubmission._id;

            const isAddBtnVisible = !isSubmitted && new Date().getTime() < new Date(lectSub.endDate.timeStamp);

            wrapper.innerHTML = `
  <div class="submission-header">
    <h2>${courseSubmission.courseName}</h2>
    <span class="course-code">[${courseSubmission.courseCode}]</span>
    <button 
      class="add-submission-btn disabled" 
      style="display: ${isAddBtnVisible ? '' : 'none'}"
      onclick="renderAddSubmissionModal('${courseSubmission._id}', '${lectSub._id}')">
      Add Submission
    </button>
  </div>

  <div class="submission-details">
    <p><strong>Lecturer:</strong> ${lectName || '<Lecturer Not Found>'}</p>
    <p><strong>Title:</strong> ${lectSub.title}</p>
    <p><strong>Instructions:</strong> ${lectSub.instructions}</p>
    <p><strong>Release Date:</strong> ${formatTimestamp(lectSub.startDate.date)}</p>
    <p><strong>Due Date:</strong> ${formatTimestamp(lectSub.endDate.date)}</p>
    <p class="status submitted">
      <strong>Status:</strong> ${isSubmitted ? 'Submitted' : 'No submission added'}
      <span style="color: var(--purple);">
        ${isSubmitted ? formatTimestamp(studentSub.date) : ''}
      </span>
    </p>
  </div>

  <div class="submission-file" style="display: ${isSubmitted ? 'block' : 'none'};">
    <i class="file-icon">📄</i>
    <span class="file-name">${isSubmitted ? studentSub.filename : ''}</span>
    <button class="view-submission-btn download-sub">
      <a href="${isSubmitted ? studentSub.fileUrl : ''}" download="${isSubmitted ? studentSub.filename : ''}">
        Download
      </a>
    </button>
    <button class="view-submission-btn delete-sub" 
      style="display: ${new Date().getTime() >= new Date(lectSub.endDate.timeStamp) ? 'none' : ''}">
      <a href="/submissions/student/delete/${studentData.data.id}/?subId=${courseSubmission._id}">
        Delete
      </a>
    </button>
  </div>
`;


            container.appendChild(wrapper);
        }
    }

}

const quizSubsRender = (data) => {
    const _docs = [...data];
    console.log(_docs)

    if (_docs.length === 0) {
        //no subs for this student
        return
    }

    container.innerHTML = ""

    for (let doc of _docs) {
        const wrapper = document.createElement("details");
        wrapper.classList.add("quiz-sub");
        wrapper.id = doc._id;

        wrapper.innerHTML = `
  <summary>${doc.courseCode} <span><strong>Score: </strong>${doc.score}</span></summary>
  <div id="${doc.quiz_id}"></div>
`;

        container.append(wrapper);

        doc.responses.forEach((q, index) => {
            const questions = document.createElement('div');
            questions.classList.add('question-single-span');
            questions.innerHTML = `
    <p>${index + 1}. ${q.question.question}</p>
    ${q.question.options.map((option, i) => `
      <label><input type="radio" name="q${index + 1}" value="${String.fromCharCode(97 + i)}" ${q.answer === String.fromCharCode(97 + i) ? 'checked' : ''}> ${String.fromCharCode(97 + i)}. ${option}</label><br>
    `).join('')}
    <div>Answer: ${q.answer}</div>
    <div>Expected: ${q.question.correctAnswer.toLowerCase()}</div>
  `;
            document.getElementById(doc.quiz_id).append(questions);
        });


    }
}

const renderQuizSubmissions = async () => {
    const student_id = studentData.data.id;

    try {
        const url = `/submissions/student/get-quiz/?id=${student_id}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        quizSubsRender(data);
    } catch (error) {
        console.log(error);
    }
}

const showSubmissions = async (courseId) => {
    container.innerHTML = ""
    if (courseId === "quiz") {
        return await renderQuizSubmissions();
    }
    else {
        const courseCollection = courseId === "all"
            ? [...submissionsCollection]
            : [...submissionsCollection].filter((course) => course._id === courseId);

        return await renderSubmissionsByCourse(courseCollection);
    }
}

const filterSubmissions = async (filterId) => {
    console.log({ button, filterId })
}

const submissionsMain = async (studentAuth = true) => {
    if (!studentAuth) return window.location.replace('/login');

    await showSubmissions("quiz");
}

document.addEventListener("DOMContentLoaded", submissionsMain);