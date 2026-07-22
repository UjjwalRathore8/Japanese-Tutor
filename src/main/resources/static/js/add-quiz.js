
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login.html";
}

const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const submitBtn = document.getElementById("submitBtn");
const messageDiv = document.getElementById("message");
const questionsContainer = document.getElementById("questionsContainer");

let questionCount = 0;

function addQuestion() {
    questionCount++;

    const div = document.createElement("div");
    div.className = "question-card";

    div.innerHTML = `
        <h3>Question ${questionCount}</h3>

        <input type="text" class="questionText" placeholder="Enter question">

        <input type="text" class="optionA" placeholder="Option A">
        <input type="text" class="optionB" placeholder="Option B">
        <input type="text" class="optionC" placeholder="Option C">
        <input type="text" class="optionD" placeholder="Option D">

        <select class="correctAnswer">
            <option value="">Select Correct Answer</option>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
        </select>

        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">
            Remove
        </button>
    `;

    questionsContainer.appendChild(div);
}

function showMessage(text, type) {
    messageDiv.innerText = text;
    messageDiv.className = "message";

    if (type === "success") {
        messageDiv.classList.add("message-success");
    } else if (type === "info") {
        messageDiv.classList.add("message-info");
    } else {
        messageDiv.classList.add("message-error");
    }

    messageDiv.style.display = "block";
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Adding Quiz...";
    } else {
        submitBtn.disabled = false;
        submitBtn.innerText = "➕ Add Quiz";
    }
}

function collectQuestions() {
    const cards = document.querySelectorAll(".question-card");
    const questions = [];

    cards.forEach(card => {
        const questionText = card.querySelector(".questionText").value.trim();
        const optionA = card.querySelector(".optionA").value.trim();
        const optionB = card.querySelector(".optionB").value.trim();
        const optionC = card.querySelector(".optionC").value.trim();
        const optionD = card.querySelector(".optionD").value.trim();

        const selectedCorrect = card.querySelector(".correctAnswer").value;

        let correctAnswer = "";

        if (selectedCorrect === "A") {
            correctAnswer = optionA;
        } else if (selectedCorrect === "B") {
            correctAnswer = optionB;
        } else if (selectedCorrect === "C") {
            correctAnswer = optionC;
        } else if (selectedCorrect === "D") {
            correctAnswer = optionD;
        }

        questions.push({
            questionText: questionText,
            optionA: optionA,
            optionB: optionB,
            optionC: optionC,
            optionD: optionD,
            correctAnswer: correctAnswer
        });
    });

    return questions;
}

function validateInputs() {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const questions = collectQuestions();

    if (!title) {
        showMessage("Please enter quiz title", "error");
        titleInput.focus();
        return false;
    }

    if (!description) {
        showMessage("Please enter description", "error");
        descInput.focus();
        return false;
    }

    if (questions.length === 0) {
        showMessage("Please add at least one question", "error");
        return false;
    }

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        if (!q.questionText) {
            showMessage(`Please enter question text in Question ${i + 1}`, "error");
            return false;
        }

        if (!q.optionA || !q.optionB || !q.optionC || !q.optionD) {
            showMessage(`Please fill all options in Question ${i + 1}`, "error");
            return false;
        }

        if (!q.correctAnswer) {
            showMessage(`Please select correct answer in Question ${i + 1}`, "error");
            return false;
        }
    }

    return true;
}

async function addQuiz() {
    if (!validateInputs()) {
        return;
    }

    const quizData = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        questions: collectQuestions()
    };

    console.log("QUIZ DATA SENT:", quizData);

    try {
        setLoading(true);
        showMessage("Adding quiz...", "info");

        const response = await fetch("/trainer/add-quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(quizData)
        });

        if (response.ok) {
            showMessage("✅ Quiz added successfully", "success");

            titleInput.value = "";
            descInput.value = "";
            questionsContainer.innerHTML = "";
            questionCount = 0;

            addQuestion();
            titleInput.focus();
        } else {
            const error = await response.text();
            showMessage(error || "Failed to add quiz", "error");
        }

    } catch (error) {
        console.error("Add quiz error:", error);
        showMessage("Server error. Please try again.", "error");
    } finally {
        setLoading(false);
    }
}

submitBtn.addEventListener("click", addQuiz);

window.addQuestion = addQuestion;

addQuestion();