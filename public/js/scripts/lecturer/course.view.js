const addLesson = (targetButton) => {
    const courseId = document.getElementById('courseId').value;
    const lecturerId = document.getElementById('lecturerId').value;
    const courseVersion = document.getElementById('v').value;


    const lessonForm = document.createElement("form");
    lessonForm.setAttribute('enctype', 'multipart/form-data');
    lessonForm.setAttribute('id', 'lessonForm');
    lessonForm.setAttribute('method', "post");
    lessonForm.setAttribute('action', `/lecturer/courses/addLesson/${courseId}/${courseVersion}/${lecturerId}` );

    lessonForm.innerHTML = `
        <input type="hidden" name="chapter" id="chapter" value="${targetButton.getAttribute("data-chapter")}">
        <div>
            <label for="lessonName">Lesson:</label>
            <input type="text" id="lessonName" name="lessonName" required>
        </div>
        <div>
            <label for="lessonFile">Lesson File: <small>optional</small></label>
            <input type="file" id="lessonFile" name="lessonFile">
        </div>
        <button type="submit" id="submit-lesson-btn">Submit</button>
    `;

    document.querySelector('.chapter-form').appendChild(lessonForm);

    lessonForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const lesson = lessonForm.querySelector("#lessonName").value;
        
        lessonForm.submit();

    });
}

const createNewChapter = async () => {
    const courseId = document.getElementById('courseId').value;
    const lecturerId = document.getElementById('lecturerId').value;
    const courseVersion = document.getElementById('v').value;

    const req = await fetch(`/lecturer/courses/addchapter/${courseId}/${courseVersion}/${lecturerId}`);
    const res = await req.json();

    if (res.message == 'success') {
        window.location.reload();
    }
}

const main = () => {
    const addNewChptBtn = document.getElementById("add-chapter");

    addNewChptBtn.addEventListener("click", createNewChapter);
}

document.addEventListener("DOMContentLoaded", main);