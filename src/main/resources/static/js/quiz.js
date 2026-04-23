// ======================= GET QUIZ ID FROM URL =======================
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("quizId");
const token = localStorage.getItem("token");

// Store quiz data globally
let quizData = null;
let userAnswers = {};

// ======================= VALIDATION =======================
function validateSession() {
    if (!quizId) {
        showError("No quiz selected", "Please select a quiz from the dashboard.", true);
        return false;
    }
    
    if (!token) {
        showError("Authentication required", "Please login to access quizzes.", true);
        return false;
    }
    
    return true;
}

function showError(title, message, redirectToLogin = false) {
    const container = document.getElementById("quizContentArea");
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <div class="error-title">${escapeHtml(title)}</div>
            <div class="error-message">${escapeHtml(message)}</div>
            <button class="btn-retry" id="errorActionBtn">${redirectToLogin ? 'Go to Login' : 'Back to Dashboard'}</button>
        </div>
    `;
    
    const actionBtn = document.getElementById("errorActionBtn");
    if (actionBtn) {
        actionBtn.addEventListener("click", () => {
            if (redirectToLogin) {
                localStorage.removeItem("token");
                window.location.href = "/login.html";
            } else {
                window.location.href = "/dashboard.html";
            }
        });
    }
}

// ======================= FETCH QUIZ DATA =======================
function fetchQuiz() {
    const container = document.getElementById("quizContentArea");
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading quiz questions...</div>
        </div>
    `;

    fetch(`/Quiz/get/${quizId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized: Please login again");
            } else if (response.status === 404) {
                throw new Error("Quiz not found");
            } else {
                throw new Error(`Server error: ${response.status}`);
            }
        }
        return response.json();
    })
    .then(data => {
        console.log("Quiz data loaded:", data);
        quizData = data;
        
        if (!quizData.questions || quizData.questions.length === 0) {
            renderEmptyState();
        } else {
            renderQuiz(quizData);
        }
    })
    .catch(error => {
        console.error("Quiz fetch error:", error);
        renderFetchError(error.message);
    });
}

// ======================= RENDER QUIZ INTERFACE =======================
function renderQuiz(data) {
    const container = document.getElementById("quizContentArea");
    
    const quizTitle = data.title ? escapeHtml(data.title) : "Untitled Quiz";
    const questionCount = data.questions.length;
    
    let questionsHtml = '';
    
    data.questions.forEach((question, index) => {
        const questionId = question.id;
        const questionText = question.questionText ? escapeHtml(question.questionText) : `Question ${index + 1}`;
       
        questionsHtml += `
            <div class="question-card" data-question-id="${questionId}">
                <div class="question-text">${index + 1}. ${questionText}</div>
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
    
    const answeredCount = getAnsweredCount();
    
    const html = `
        <div class="quiz-header">
            <h1 class="quiz-title">${quizTitle}</h1>
            <div class="quiz-meta">
                <span class="question-count">📋 ${questionCount} questions</span>
                <span class="quiz-id-badge">Quiz ID: ${escapeHtml(quizId)}</span>
            </div>
        </div>
        
        <div class="questions-container" id="questionsContainer">
            ${questionsHtml}
        </div>
        
        <div class="submit-section">
            <div class="progress-indicator" id="progressIndicator">${answeredCount} of ${questionCount} answered</div>
            <button class="btn-submit" id="submitQuizBtn">Submit Quiz ✓</button>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Attach radio change listeners to update progress
    attachRadioListeners();
    
    // Attach submit button listener
    const submitBtn = document.getElementById("submitQuizBtn");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitQuiz);
    }
    
    updateProgressIndicator();
}

function attachRadioListeners() {
    if (!quizData || !quizData.questions) return;
    
    quizData.questions.forEach(question => {
        const radioButtons = document.querySelectorAll(`input[name="q${question.id}"]`);
        radioButtons.forEach(radio => {
            radio.addEventListener("change", (e) => {
                if (e.target.checked) {
                    userAnswers[question.id] = e.target.value;
                    updateProgressIndicator();
                }
            });
        });
        
        // Restore previously selected answer if any
        if (userAnswers[question.id]) {
            const savedValue = userAnswers[question.id];
            const savedRadio = document.querySelector(`input[name="q${question.id}"][value="${savedValue}"]`);
            if (savedRadio) {
                savedRadio.checked = true;
            }
        }
    });
}

function getAnsweredCount() {
    if (!quizData || !quizData.questions) return 0;
    let count = 0;
    quizData.questions.forEach(q => {
        if (userAnswers[q.id]) count++;
    });
    return count;
}

function updateProgressIndicator() {
    const indicator = document.getElementById("progressIndicator");
    if (indicator && quizData && quizData.questions) {
        const answered = getAnsweredCount();
        const total = quizData.questions.length;
        indicator.textContent = `${answered} of ${total} answered`;
        
        const submitBtn = document.getElementById("submitQuizBtn");
        if (submitBtn) {
            if (answered === total && total > 0) {
                submitBtn.style.background = "#2f6b47";
                indicator.style.color = "#0c6b4b";
            } else {
                submitBtn.style.background = "#2c6e9e";
                indicator.style.color = "#5b6e8c";
            }
        }
    }
}

function renderEmptyState() {
    const container = document.getElementById("quizContentArea");
    container.innerHTML = `
        <div class="empty-state">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📭</div>
            <p>No questions available for this quiz.</p>
            <button class="btn-retry" id="backToDashboardBtn" style="margin-top: 1rem;">Back to Dashboard</button>
        </div>
    `;
    const backBtn = document.getElementById("backToDashboardBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "/dashboard.html";
        });
    }
}

function renderFetchError(errorMsg) {
    const container = document.getElementById("quizContentArea");
    let userMessage = "Unable to load quiz.";
    if (errorMsg.includes("Unauthorized")) {
        userMessage = "Your session has expired. Please login again.";
    } else if (errorMsg.includes("not found")) {
        userMessage = "The requested quiz does not exist.";
    } else if (errorMsg.includes("Network")) {
        userMessage = "Network error. Please check your connection.";
    } else {
        userMessage = errorMsg;
    }
    
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">❌</div>
            <div class="error-title">Failed to Load Quiz</div>
            <div class="error-message">${escapeHtml(userMessage)}</div>
            <button class="btn-retry" id="retryFetchBtn">Try Again</button>
            <button class="btn-retry" id="dashboardRedirectBtn" style="background: #5a6a7e; margin-left: 0.5rem;">Dashboard</button>
        </div>
    `;
    
    const retryBtn = document.getElementById("retryFetchBtn");
    if (retryBtn) {
        retryBtn.addEventListener("click", () => {
            fetchQuiz();
        });
    }
    
    const dashboardBtn = document.getElementById("dashboardRedirectBtn");
    if (dashboardBtn) {
        dashboardBtn.addEventListener("click", () => {
            window.location.href = "/dashboard.html";
        });
    }
}

// ======================= SUBMIT QUIZ =======================
function submitQuiz() {
    if (!quizData || !quizData.questions) {
        alert("Quiz data not available.");
        return;
    }
    
    const totalQuestions = quizData.questions.length;
    const answeredCount = getAnsweredCount();
    
    if (answeredCount < totalQuestions) {
        alert(`Please answer all ${totalQuestions} questions before submitting. (${answeredCount} answered)`);
        return;
    }
    
    // Build answers array in the required format
    const answers = quizData.questions.map(question => {
        const selectedOption = userAnswers[question.id] || "";
        return {
            questionId: question.id,
            selectedOption: selectedOption
        };
    });
    
    // Disable submit button to prevent double submission
    const submitBtn = document.getElementById("submitQuizBtn");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
    }
    
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
            throw new Error(`Submission failed: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        alert("Quiz submitted successfully!");
        window.location.href = "/result.html";
    })
    .catch(error => {
        console.error("Submit error:", error);
        alert("Error submitting quiz: " + error.message);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Quiz ✓";
        }
    });
}

// ======================= UTILITY FUNCTIONS =======================
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function goToDashboard() {
    window.location.href = "/dashboard.html";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("quizId");
    localStorage.removeItem("lessonId");
    window.location.href = "/login.html";
}

// ======================= INITIALIZATION =======================
if (validateSession()) {
    fetchQuiz();
}

// Attach navigation event listeners
document.addEventListener("DOMContentLoaded", () => {
    const dashboardBtn = document.getElementById("dashboardBtn");
    if (dashboardBtn) {
        dashboardBtn.addEventListener("click", goToDashboard);
    }
    
    const logoutNavBtn = document.getElementById("logoutBtn");
    if (logoutNavBtn) {
        logoutNavBtn.addEventListener("click", logout);
    }
});

// Keep global functions for compatibility
window.submitQuiz = submitQuiz;
window.goToDashboard = goToDashboard;
window.logout = logout;