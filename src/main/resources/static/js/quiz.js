
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quizId");
const token = localStorage.getItem("token");

let quizData = null;
let userAnswers = {};

function validateSession() {
    if (!quizId) {
        alert("No quiz selected");
        window.location.href = "/dashboard.html";
        return false;
    }

    if (!token) {
        alert("Please login first");
        window.location.href = "/login.html";
        return false;
    }

    return true;
}

function fetchQuiz() {
    fetch(`/Quiz/get/${quizId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Quiz data loaded:", data);
        quizData = data;
        renderQuiz(data);
    })
    .catch(err => {
        console.error("Quiz fetch error:", err);
        alert("Failed to load quiz");
    });
}

function renderQuiz(data) {
    const container = document.getElementById("quizContentArea");

    let questionsHtml = "";

    data.questions.forEach((question, index) => {
        const questionId = question.id;

        questionsHtml += `
            <div class="question-card">
                <div class="question-text">${index + 1}. ${escapeHtml(question.questionText)}</div>

                <div class="options-list">
                    <div class="option-item">
                        <input type="radio" name="q${questionId}" value="${escapeHtml(question.optionA)}">
                        <label>${escapeHtml(question.optionA)}</label>
                    </div>

                    <div class="option-item">
                        <input type="radio" name="q${questionId}" value="${escapeHtml(question.optionB)}">
                        <label>${escapeHtml(question.optionB)}</label>
                    </div>

                    <div class="option-item">
                        <input type="radio" name="q${questionId}" value="${escapeHtml(question.optionC)}">
                        <label>${escapeHtml(question.optionC)}</label>
                    </div>

                    <div class="option-item">
                        <input type="radio" name="q${questionId}" value="${escapeHtml(question.optionD)}">
                        <label>${escapeHtml(question.optionD)}</label>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="quiz-header">
            <h1 class="quiz-title">${escapeHtml(data.title)}</h1>
            <p>${data.questions.length} questions</p>
        </div>

        <div id="questionsContainer">
            ${questionsHtml}
        </div>

        <div class="submit-section">
            <div id="progressIndicator">0 of ${data.questions.length} answered</div>
            <button id="submitQuizBtn" class="btn-submit">Submit Quiz ✓</button>
        </div>
    `;

    attachRadioListeners();

    document.getElementById("submitQuizBtn").addEventListener("click", submitQuiz);
}

function attachRadioListeners() {
    quizData.questions.forEach(question => {
        const radios = document.querySelectorAll(`input[name="q${question.id}"]`);

        radios.forEach(radio => {
            radio.addEventListener("change", e => {
                userAnswers[question.id] = e.target.value;
                updateProgressIndicator();
            });
        });
    });
}

function getAnsweredCount() {
    let count = 0;

    quizData.questions.forEach(q => {
        if (userAnswers[q.id]) {
            count++;
        }
    });

    return count;
}

function updateProgressIndicator() {
    const answered = getAnsweredCount();
    const total = quizData.questions.length;

    document.getElementById("progressIndicator").innerText =
        `${answered} of ${total} answered`;
}

function submitQuiz() {
    const totalQuestions = quizData.questions.length;
    const answeredCount = getAnsweredCount();

    if (answeredCount < totalQuestions) {
        alert(`Please answer all ${totalQuestions} questions`);
        return;
    }

    const answers = quizData.questions.map(question => {
        return {
            questionId: question.id,
            selectedOption: userAnswers[question.id]
        };
    });

    console.log("FINAL JSON SENT:", JSON.stringify({
        quizId: parseInt(quizId),
        answers: answers
    }, null, 2));

    fetch("/Quiz/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            quizId: parseInt(quizId),
            answers: answers
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Quiz submission failed");
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        window.location.href = "/result.html";
    })
    .catch(error => {
        console.error("Submit error:", error);
        alert("Error submitting quiz");
    });
}

function escapeHtml(str) {
    if (!str) return "";

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", () => {
    if (validateSession()) {
        fetchQuiz();
    }
});

