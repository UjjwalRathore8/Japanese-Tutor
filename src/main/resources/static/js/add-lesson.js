
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login.html";
}

const titleInput = document.getElementById("title");
const typeInput = document.getElementById("type");
const descInput = document.getElementById("description");
const contentInput = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const messageDiv = document.getElementById("message");

function showMessage(text, type) {
    messageDiv.innerText = text;
    messageDiv.className = "message";

    if (type === "success") {
        messageDiv.classList.add("message-success");
    } else {
        messageDiv.classList.add("message-error");
    }
}

function addWordField() {
    const div = document.createElement("div");
    div.className = "word-row";

    div.innerHTML = `
        <input class="word" placeholder="Word e.g. こんにちは">
        <input class="meaning" placeholder="Meaning e.g. Hello">
        <input class="romaji" placeholder="Romaji e.g. Konnichiwa">
        <button type="button" class="btn-small" onclick="this.parentElement.remove()">Remove</button>
    `;

    document.getElementById("wordsContainer").appendChild(div);
}

function collectWords() {
    const rows = document.querySelectorAll(".word-row");
    const words = [];

    rows.forEach(row => {
        const word = row.querySelector(".word").value.trim();
        const meaning = row.querySelector(".meaning").value.trim();
        const romaji = row.querySelector(".romaji").value.trim();

        if (word && meaning && romaji) {
            words.push({ word, meaning, romaji });
        }
    });

    return words;
}

async function addLesson() {
    const lessonData = {
        title: titleInput.value.trim(),
        type: typeInput.value.trim(),
        description: descInput.value.trim(),
        content: contentInput.value.trim()
    };

    if (!lessonData.title || !lessonData.type || !lessonData.description || !lessonData.content) {
        showMessage("Please fill all lesson fields", "error");
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Adding...";

        const response = await fetch("/trainer/add-lesson", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(lessonData)
        });

        if (!response.ok) {
            showMessage("Lesson not added", "error");
            return;
        }

        const savedLesson = await response.json();
        const lessonId = savedLesson.id;

        const words = collectWords();

        for (const w of words) {
            await fetch("/lessonwords/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    lessonId: lessonId,
                    word: w.word,
                    meaning: w.meaning,
                    romaji: w.romaji
                })
            });
        }

        showMessage("Lesson and words added successfully", "success");

    } catch (error) {
        showMessage("Network error. Please try again.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "➕ Add Lesson";
    }
}

submitBtn.addEventListener("click", addLesson);