let timer;
let durationPerQuestion;
let counter = 0;
let quizQuestions;
let q_count;
let score = 0;
let quiz_id;
let courseCode;
let studentsResponses = [];

let studentId = sessionStorage.getItem('auth-user') ? JSON.parse(sessionStorage.getItem('auth-user')).data.id : null;
console.log({ studentId })
if (!studentId) window.history.back();

const calculateTimePerQuestion = (duration, count) => {
    if (count === 0) return 0;
    return Math.floor(duration / count);
}

const submitStudentScore = async (responses, score, courseCode) => {
    const _render = document.getElementById("onboard-main");
    _render.innerHTML = `
        <div>
            <p>Saving Attempt...</p>
        </div>
    `;

    let _responses = responses;
    let _score = score;
    let course_code = courseCode
    const body = { responses: _responses, score: _score };
    const url = encodeURI(`/submissions/students/quiz?sid=${studentId}&qid=${quiz_id}&code=${course_code}`)
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log(data);
        return window.location.href = `/students/render/quizzes/${studentId}`
    } catch (error) {
        console.log(error)
    }
}

const renderQuestion = (question, end = false) => {
    const _render = document.getElementById("onboard-main");
    _render.innerHTML = "";
    const section = document.createElement('section');
    section.classList.add('quiz-start');

    section.innerHTML = `
     <div class="timer">
        <p id="timer-countDown"> --:-- minutes</p>
    </div>
    <div class="question-single-span">
        <p>${counter}. ${question.question}</p>
        <label><input type="radio" name="q${counter}" value="a"> a. ${question.options[0]}.</label><br>
        <label><input type="radio" name="q${counter}" value="b"> b. ${question.options[1]}</label><br>
        <label><input type="radio" name="q${counter}" value="c"> c. ${question.options[2]}</label><br>
        <label><input type="radio" name="q${counter}" value="d"> d. ${question.options[3]}</label><br>
    </div>  
    <div class="next-btn">
        <button type="button" onclick="previousQuestion()">Back</button>
        <button type="button" onclick="${end ? 'submitTest()' : 'nextQuestion()'}">${end ? 'Submit' : 'Next'}</button>
    </div> 
    `

    _render.append(section);

}

const previousQuestion = () => {
    console.log({ counter });
    counter -= 2;
    console.log({ counter });

    // Clear the timer and call nextQuestion to load the previous one
    clearInterval(timer);
    nextQuestion();

}

const nextQuestion = async (start= false) => {
    const _question = quizQuestions[counter];
    console.log({ studentsResponses })

    if (!start) {
        const selectedRadio = document.querySelector(`input[name="q${counter}"]:checked`);
        let answer;

        if (selectedRadio) {
            answer = selectedRadio.value;
            let i = counter - 1;
            let correct_answer = quizQuestions[i].correctAnswer?.toLowerCase() || null;

            // Check if the answer is correct
            if (answer === correct_answer || correct_answer === null) {
                score++;
            }

        } else {
            answer = null;
            console.log(`Chose answer: ${answer} for question ${counter}`);
            console.log(`No answer selected for question ${counter}`);
        }

        // Clone the previous responses up to the current counter
        let clonedResponses = studentsResponses.slice(0, counter);
        clonedResponses.push({ question: _question, answer: answer });

        // Update the studentsResponses array
        studentsResponses = [...clonedResponses];
    }

    if (counter < q_count) {
        counter++;
        console.log("Moving to the next question...");
        renderQuestion(_question)
    }
    else {
        console.log("end of questions", counter, q_count);
        console.log('your score is: ', score);
        submitStudentScore(studentsResponses, score, courseCode);
        return;
    }
    startQuestionTimer(durationPerQuestion);
}

const startQuestionTimer = (durationPerQuestion) => {
    let timeRemaining = durationPerQuestion * 60;
    clearInterval(timer);
    // Update timer display every second
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer); // Stop the timer
            nextQuestion(true); //next question
            return;
        }
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('timer-countDown').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutes`;

        timeRemaining--;
    }, 1000);
}

const startQuiz = async () => {

    alert('starting quiz...');
    document.getElementById("q-header").innerHTML = ""
    document.getElementById("q-header").style.display = "none";
    nextQuestion();
}

const onboardMain = () => {
    const _questions = JSON.parse(document.getElementById("qsts").value);
    quiz_id = _questions._id;
    courseCode = _questions.courseCode;
    quizQuestions = Array.from(_questions.questions);
    q_count = quizQuestions.length
    durationPerQuestion = calculateTimePerQuestion(_questions.duration, quizQuestions.length);
    console.log("duration is ", durationPerQuestion)
}

document.addEventListener('DOMContentLoaded', onboardMain);