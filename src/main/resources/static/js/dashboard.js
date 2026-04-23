// ======================= TOKEN & AUTHENTICATION =======================
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "/login.html";
}

// Parse user info from JWT token (sub field)
let currentUserEmail = "Learner";
try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const userSub = payload.sub || payload.email || "User";
    if (userSub && userSub.includes('@')) {
        currentUserEmail = userSub.split('@')[0];
    } else {
        currentUserEmail = userSub;
    }
} catch (err) {
    console.warn("JWT parse warning", err);
    currentUserEmail = "Learner";
}

const userNameSpan = document.getElementById("userNameDisplay");
if (userNameSpan) userNameSpan.innerText = currentUserEmail;

// Helper: fetch with authorization header
function authFetch(url, options = {}) {
    const headers = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
}

// Simple XSS protection
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ======================= LOAD LESSONS =======================
function loadLessons() {
    const container = document.getElementById("lessonsContainer");
    container.innerHTML = `<div class="loading-skeleton"></div>`;
    
    authFetch("/lesson/all")
        .then(res => {
            if (!res.ok) throw new Error(`Lesson API error: ${res.status}`);
            return res.json();
        })
        .then(lessons => {
            if (!lessons || lessons.length === 0) {
                container.innerHTML = `<div class="empty-state">No lessons available at the moment.</div>`;
                return;
            }
            
            let gridHtml = `<div class="card-grid">`;
            lessons.forEach(lesson => {
                const title = lesson.title ? lesson.title : "Untitled Lesson";
                const type = lesson.type && lesson.type.trim() ? lesson.type : "General";
                const description = lesson.description && lesson.description.trim() ? lesson.description : "Start learning with this interactive lesson.";
                
                gridHtml += `
                    <div class="lesson-card">
                        <div class="card-content">
                            <div class="card-title">${escapeHtml(title)}</div>
                            <div class="type-tag">${escapeHtml(type)}</div>
                            <div class="card-description">${escapeHtml(description)}</div>
                            <button class="btn-start" data-lesson-id="${lesson.id}">
                                Open Lesson →
                            </button>
                        </div>
                    </div>
                `;
            });
            gridHtml += `</div>`;
            container.innerHTML = gridHtml;
            
            // Attach event listeners to lesson buttons
            document.querySelectorAll('.btn-start[data-lesson-id]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lessonId = btn.getAttribute('data-lesson-id');
                    if (lessonId) {
                        localStorage.setItem("lessonId", lessonId);
                        window.location.href = "/lesson.html";
                    }
                });
            });
        })
        .catch(err => {
            console.error("Lessons fetch error:", err);
            container.innerHTML = `<div class="error-message">Failed to load lessons. Please check your connection or server status.</div>`;
        });
}

// ======================= LOAD QUIZZES =======================
function loadQuizzes() {
    const container = document.getElementById("quizzesContainer");
    container.innerHTML = `<div class="loading-skeleton"></div>`;
    
    authFetch("/Quiz/all")
        .then(res => {
            if (!res.ok) throw new Error(`Quiz API error: ${res.status}`);
            return res.json();
        })
        .then(quizzes => {
            if (!quizzes || quizzes.length === 0) {
                container.innerHTML = `<div class="empty-state">No quizzes available at the moment.</div>`;
                return;
            }
            
            let gridHtml = `<div class="card-grid">`;
            quizzes.forEach(quiz => {
                const title = quiz.title ? quiz.title : "Untitled Quiz";
                const description = quiz.description && quiz.description.trim() ? quiz.description : "Test your knowledge with this quiz.";
                
                gridHtml += `
                    <div class="quiz-card">
                        <div class="card-content">
                            <div class="card-title">${escapeHtml(title)}</div>
                            <div class="type-tag quiz-tag">Assessment</div>
                            <div class="card-description">${escapeHtml(description)}</div>
                            <button class="btn-start" data-quiz-id="${quiz.id}">
                                Start Quiz →
                            </button>
                        </div>
                    </div>
                `;
            });
            gridHtml += `</div>`;
            container.innerHTML = gridHtml;
            
            // Attach event listeners to quiz buttons
            document.querySelectorAll('.btn-start[data-quiz-id]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const quizId = btn.getAttribute('data-quiz-id');
                    if (quizId) {
                        localStorage.setItem("quizId", quizId);
                        window.location.href = `/quiz.html?quizId=${quizId}`;
                    }
                });
            });
        })
        .catch(err => {
            console.error("Quizzes fetch error:", err);
            container.innerHTML = `<div class="error-message">Failed to load quizzes. Please verify the backend service.</div>`;
        });
}

// ======================= NAVIGATION & UTILITIES =======================
function goToResults() {
    window.location.href = "/result.html";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("quizId");
    localStorage.removeItem("lessonId");
    window.location.href = "/login.html";
}

// Bind button events
const resultsBtn = document.getElementById("resultsBtn");
if (resultsBtn) resultsBtn.addEventListener("click", goToResults);

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// Keep global functions for potential inline usage
window.goResult = goToResults;
window.logout = logout;
window.startQuiz = function(id) {
    if (id) {
        localStorage.setItem("quizId", id);
        window.location.href = `/quiz.html?quizId=${id}`;
    }
};
window.openLesson = function(id) {
    if (id) {
        localStorage.setItem("lessonId", id);
        window.location.href = "/lesson.html";
    }
};

// Initialize dashboard
loadLessons();
loadQuizzes();