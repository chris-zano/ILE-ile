const userdata = sessionStorage.getItem('auth-user') ? JSON.parse(sessionStorage.getItem('auth-user')) : undefined;
if (!userdata) console.log("No userdata defined");

let form = null;
let _width = window.innerWidth;
let _form = document.getElementById("container_form");
let _questions = document.getElementById("quiz-view");
let _enterDetails = document.getElementById("q-enter-details");

let _saveAllBtn = document.getElementById("save-all");
let _addQuestionBtn = document.getElementById("quiz-nav");
let _clearMemoryBtn = document.getElementById("clear-memory");

const toggleAttribute = (element, attributeName, value = "") => {
    element.setAttribute(attributeName, value);
};

const toggleForm = () => {
    try {
        _questions.style.display = "none";
        _form.style.display = "block";
    } catch (error) {
        console.log(error)
    }
}

const closeForm = () => {
    try {
        _form.style.display = "none";
        _questions.style.display = "block";
    } catch (error) {
        console.log(error)
    }
}

const saveQuestionsToDatabase = async (code, qst, det) => {
    const url = `/quiz/create`;
    const body = { courseCode: code, questions: qst, details: det };
    const response = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await response.data;

    console.log({ status: response.status, data });

    if (response.ok) {
        clearMemory();
        location.reload()
    }
}

const saveAll = async () => {
    const _courseCode = document.getElementById("courseCode").value || null;
    const questions = localStorage.getItem('quiz-data') ? JSON.parse(localStorage.getItem('quiz-data')) : null;

    if (Array.from(questions).length === 0) {
        Toast_Notification.showWarning('Failed to save all. No questions added.');
        console.log({ courseCode: _courseCode, questions: questions });
        return null;
    }

    if (Array.from(questions).length < 10) {
        Toast_Notification.showWarning('Failed to save. At least 10 questions needed.');
        console.log({ courseCode: _courseCode, questions: questions });
        return null;
    }

    const _details = localStorage.getItem('q-details') ? JSON.parse(localStorage.getItem('q-details')) : null;

    try { 
        await saveQuestionsToDatabase(_courseCode, questions, _details); 
    }
    catch(error) {
        console.log(error);
        Toast_Notification.showInfo('Failed to save');
    }
    return true;
}

const renderNewQuestion = (question) => {
    const li = document.createElement("li");
    li.classList.add('ol-list-item');

    li.innerHTML = `
        <p>${question.question}</p>
        <label><input type="radio" name="q1" value="a"> a. ${question.options[0]}</label><br>
        <label><input type="radio" name="q1" value="b"> b. ${question.options[1]}</label><br>
        <label><input type="radio" name="q1" value="c"> c. ${question.options[2]}</label><br>
        <label><input type="radio" name="q1" value="d"> d. ${question.options[3]}</label><br>
    `;

    document.getElementById("ol-questions").append(li);
    if (_width <= 768) {
        closeForm();
    }
}

const clearMemory = () => {
    localStorage.removeItem('quiz-data');
    localStorage.removeItem('q-details');
    if (document.getElementById('clear-memory').getAttribute('aria-hidden') === 'false') {
        document.getElementById('clear-memory').setAttribute('aria-hidden', "true");
    }
    location.reload();
}

const getQDetails = () => {

    if (localStorage.getItem("q-details")) {
        _enterDetails.innerHTML = "";
        _enterDetails.style.display = 'none'

        toggleAttribute(_form, "aria-hidden", "false")
        toggleAttribute(_saveAllBtn, "aria-hidden", "false")
        toggleAttribute(_clearMemoryBtn, "aria-hidden", "false")
        toggleAttribute(_addQuestionBtn, "aria-hidden", "true")

        return false;
    }

    toggleAttribute(_form, "aria-hidden", "true")
    toggleAttribute(_saveAllBtn, "aria-hidden", "true")
    toggleAttribute(_clearMemoryBtn, "aria-hidden", "true")
    toggleAttribute(_addQuestionBtn, "aria-hidden", "true")

    document.getElementById("q-save-title").addEventListener("click", (event) => {
        event.preventDefault();
        const _title = document.getElementById("q-title").value;
        const _start = document.getElementById("q-start").value;
        const _end = document.getElementById("q-end").value;
        const _duration = document.getElementById("q-duration").value;

        const details = {
            title: _title,
            start: _start,
            end: _end,
            duration: _duration
        }

        console.log("Details: ", details);
        window.localStorage.setItem("q-details", JSON.stringify(details));
        _enterDetails.innerHTML = "";
        _enterDetails.style.display = 'none'

        toggleAttribute(_form, "aria-hidden", "false")
        toggleAttribute(_saveAllBtn, "aria-hidden", "false")
        toggleAttribute(_clearMemoryBtn, "aria-hidden", "false")
        toggleAttribute(_addQuestionBtn, "aria-hidden", "true")
    });
    return true
}

const quizMain = () => {
    getQDetails();

    const localdata = localStorage.getItem('quiz-data') ? JSON.parse(localStorage.getItem('quiz-data')) : null;
    console.log('local data', localdata)
    if (!localdata) {
        console.log('No locally saved quizzes available');
    }
    else {
        Toast_Notification.showInfo('Questions loaded from memory');
        document.getElementById('clear-memory').setAttribute('aria-hidden', "false");
        Array.from(localdata).forEach(data => {
            renderNewQuestion(data);
        })
        document.getElementById('save-all').setAttribute('aria-hidden', "false");
    }
    const courseCode = document.getElementById("courseCode").value || null;

    if (!courseCode) {
        window.history.back();
    }

    if (_width <= 768) {
        document.getElementById("quiz-nav").setAttribute("aria-hidden", 'false');
        document.getElementById("clse-btn-span").setAttribute("aria-hidden", 'false');
    }
    form = document.getElementById("questionForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const _question = document.getElementById("question").value;
        const _answerA = document.getElementById("answerA").value;
        const _answerB = document.getElementById("answerB").value;
        const _answerC = document.getElementById("answerC").value;
        const _answerD = document.getElementById("answerD").value;
        const _correctAnswer = document.getElementById("correctAnswer").value;

        const questionObj = {
            question: _question,
            options: [_answerA, _answerB, _answerC, _answerD],
            correctAnswer: _correctAnswer
        };


        try {
            let data = []
            const localStorageData = localStorage.getItem('quiz-data') ? JSON.parse(localStorage.getItem('quiz-data')) : null;

            if (!localStorageData) {
                data.push(questionObj);
            }
            else {
                data = [...localStorageData, questionObj];
            }

            localStorage.setItem("quiz-data", JSON.stringify(data));
            if (document.getElementById('clear-memory').getAttribute('aria-hidden') === 'true') {
                document.getElementById('clear-memory').setAttribute('aria-hidden', "false");
            }
        } catch (error) {
            console.log(error)
            console.log('failed to save to storage');
            Toast_Notification.showInfo('Failed to save locally');
        }
        renderNewQuestion(questionObj);
        if (document.getElementById('save-all').getAttribute('aria-hidden') === 'true') {
            document.getElementById('save-all').setAttribute('aria-hidden', "false");
        }
    })
}

document.addEventListener('DOMContentLoaded', quizMain)