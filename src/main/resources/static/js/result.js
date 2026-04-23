const token = localStorage.getItem("token");

// Token check
if (!token) {
    alert("Please login first!");
    window.location.href = "/login.html";
}

console.log("TOKEN IN RESULT PAGE:", token);

// Helper function to prevent XSS
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Fetch results from backend
fetch("/Result/my", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }
})
.then(res => {
    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("Session expired. Please login again.");
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
})
.then(data => {
    console.log("RESULTS DATA:", data);

    const resultDiv = document.getElementById("result");

    // Check if data exists and is an array
    if (!data || !Array.isArray(data) || data.length === 0) {
        resultDiv.innerHTML = `
            <div class="empty-state">
                <p>📋 No results found yet</p>
                <p>You haven't completed any quizzes.</p>
                <div class="hint">Take a quiz to see your results here.</div>
            </div>
        `;
        return;
    }

    // Build HTML for each result
    let html = "";
    
    data.forEach((result, index) => {
        // Safely access nested properties
        const quizTitle = result.quiz && result.quiz.title ? result.quiz.title : "Untitled Quiz";
        const score = result.score !== undefined && result.score !== null ? result.score : "N/A";
        
        // Format score display
        let scoreDisplay = score;
        let scoreUnit = "points";
        
        if (typeof score === "number") {
            scoreDisplay = score;
            scoreUnit = "points";
        } else if (typeof score === "string" && !isNaN(parseFloat(score))) {
            scoreDisplay = parseFloat(score).toFixed(1);
        }
        
        html += `
            <div class="result-card">
                <div class="quiz-title">${escapeHtml(quizTitle)}</div>
                <div class="score-section">
                    <span class="score-label">Your Score:</span>
                    <span class="score-value">${escapeHtml(String(scoreDisplay))}</span>
                    <span class="score-unit">${escapeHtml(scoreUnit)}</span>
                </div>
            </div>
        `;
    });
    
    resultDiv.innerHTML = html;
})
.catch(err => {
    console.error("Error loading results:", err);
    
    let errorMessage = "Failed to load results. ";
    if (err.message.includes("Session expired") || err.message.includes("401")) {
        errorMessage = "Your session has expired. Please login again.";
        setTimeout(() => {
            localStorage.removeItem("token");
            window.location.href = "/login.html";
        }, 2000);
    } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        errorMessage = "Cannot connect to server. Make sure backend is running at localhost:8080";
    } else {
        errorMessage = err.message;
    }
    
    document.getElementById("result").innerHTML = `
        <div class="error-state">
            <strong>⚠️ Error</strong><br><br>
            ${escapeHtml(errorMessage)}<br><br>
            <small>Please check your connection and try again.</small>
        </div>
    `;
});