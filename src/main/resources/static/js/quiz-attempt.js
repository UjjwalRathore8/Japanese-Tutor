const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quizId") || urlParams.get("id");

let questions = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;

async function loadQuiz() {
    console.log("Quiz ID:", quizId);

    if (!quizId) {
        alert("Quiz ID missing");
        window.location.href = "/dashboard.html";
        return;
    }

    const response = await fetch("/Quiz/get/" + quizId);
    const quiz = await response.json();

    document.getElementById("quizTitle").innerText = quiz.title;
    questions = quiz.questions;

    showQuestion();
}

function showQuestion() {
    selectedAnswer = null;

    const q = questions[currentIndex];

    document.getElementById("questionText").innerText = q.questionText;
    document.getElementById("optionA").innerText = q.optionA;
    document.getElementById("optionB").innerText = q.optionB;
    document.getElementById("optionC").innerText = q.optionC;
    document.getElementById("optionD").innerText = q.optionD;
}

function selectAnswer(option) {
    selectedAnswer = option;
}

async function nextQuestion() {
    if (!selectedAnswer) {
        alert("Please select an answer");
        return;
    }

    if (selectedAnswer === questions[currentIndex].correctAnswer) {
        score++;
    }

    currentIndex++;

    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById("questionBox").style.display = "none";
        document.getElementById("scoreBox").innerText =
            "Your Score: " + score + "/" + questions.length;

        const token = localStorage.getItem("token");

        await fetch("/Result/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                score: score,
                quiz: {
                    id: Number(quizId)
                }
            })
        });
    }
}

window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;

loadQuiz();