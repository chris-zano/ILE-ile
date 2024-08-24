const userdata = sessionStorage.getItem('auth-user') ? JSON.parse(sessionStorage.getItem('auth-user')) : undefined;
if (!userdata) console.log("No userdata defined");

let form = null;
let _width = window.innerWidth;
let _form = document.getElementById("container_form");
let _questions = document.getElementById("quiz-view");

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

const saveQuestionsToDatabase = async (code, qst) => {
    const url = `/quiz/create`;
    const body = {courseCode: code, questions: qst};
    const response = await fetch(url, {
        method: 'POST', 
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    const data = await response.data;

    console.log({status: response.status, data});

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
        console.log({courseCode: _courseCode, questions: questions});
        return null;
    }
    
    if (Array.from(questions).length < 10) {
        Toast_Notification.showWarning('Failed to save. At least 10 questions needed.');
        console.log({courseCode: _courseCode, questions: questions});
        return null;
    }

    //valid with at least 10 questions
    console.log({courseCode: _courseCode, questions: questions});
    await saveQuestionsToDatabase(_courseCode, questions);
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

const clearMemory = ()  => {
    localStorage.removeItem('quiz-data');
    if (document.getElementById('clear-memory').getAttribute('aria-hidden') === 'false') {
        document.getElementById('clear-memory').setAttribute('aria-hidden', "true");
    }
    location.reload();
}

const quizMain = () => {
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
            courseCode: courseCode,
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