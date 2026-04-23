

(function() {
    // ======================= TOKEN & AUTHENTICATION =======================
    const lessonId = localStorage.getItem("lessonId");
    const token = localStorage.getItem("token");
    
    const contentArea = document.getElementById("lessonContentArea");
    
    // Helper: Escape HTML for safe attribute values (but NOT for content rendering)
    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    
    // Helper: Render HTML content safely using innerHTML (trusted backend content)
    function renderHtmlContent(htmlString) {
        if (!htmlString) return '<span class="empty-content">— No written content —</span>';
        return htmlString;
    }
    
    // Show error state
    function showError(title, message, showRetry = false, showDashboard = true) {
        contentArea.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <div class="error-title">${escapeHtml(title)}</div>
                <div class="error-message">${escapeHtml(message)}</div>
                <div>
                    ${showRetry ? '<button class="btn-retry" id="retryBtn">Try Again</button>' : ''}
                    ${showDashboard ? '<button class="btn-retry btn-secondary" id="dashboardErrorBtn">Back to Dashboard</button>' : ''}
                </div>
            </div>
        `;
        
        if (showRetry) {
            const retryBtn = document.getElementById("retryBtn");
            if (retryBtn) retryBtn.addEventListener("click", () => fetchLessonContent());
        }
        
        const dashboardBtn = document.getElementById("dashboardErrorBtn");
        if (dashboardBtn) {
            dashboardBtn.addEventListener("click", () => {
                window.location.href = "/dashboard.html";
            });
        }
    }
    
    // Show loading state
    function showLoading() {
        contentArea.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading lesson content...</div>
            </div>
        `;
    }
	
    // Render lesson content - RENDERS HTML PROPERLY (no escaping of content)
    function renderLesson(lesson) {
        const title = lesson.title ? lesson.title : "Untitled Lesson";
        const type = lesson.type && lesson.type.trim() ? lesson.type : "General";
        const rawContent = lesson.content ? lesson.content : "No content available for this lesson.";
        
        // IMPORTANT: Render HTML content directly (not escaped)
        const renderedContent = renderHtmlContent(rawContent);
        
        const html = `
            <div class="lesson-card">
                <div class="lesson-header">
                    <h1 class="lesson-title">${escapeHtml(title)}</h1>
                    <div class="lesson-meta">
                        <span class="type-badge">${escapeHtml(type)}</span>
                    </div>
                </div>
                <div class="lesson-content">
                    <div class="content-label">
                        📄 Lesson Material
                        <span>content</span>
                    </div>
                    <div class="lesson-body">
                        ${renderedContent}
                    </div>
					
					
					<hr>

					
                </div>
            </div>
        `;
        
        contentArea.innerHTML = html;
    }
    
	
	
	function speak(text) {
	    speechSynthesis.cancel(); // stops previous audio

	    const utterance = new SpeechSynthesisUtterance(text);
	    utterance.lang = "ja-JP";
	    utterance.rate = 0.9;
	    utterance.pitch = 1;

	    speechSynthesis.speak(utterance);
	}

	window.speak = speak;
	
	
	
	function loadLessonWords(lessonId) {
	    fetch(`/lessonwords/${lessonId}`
			, {
			    method: "GET",
			    headers: {
			        "Authorization": "Bearer " + token,
			        "Content-Type": "application/json"
			    }
			}
		)
	        .then(res => res.json())
	        .then(data => renderWords(data))
	        .catch(err => console.log(err));
	}
	
	
	function renderWords(words) {
	    let html = `<hr><div class="word-container">`;

	    words.forEach(w => {
	        html += `
	            <div class="word-card">
	                <h3>${w.word}</h3>
	                <p>${w.meaning}</p>
	                <p><b>Romaji:</b> ${w.romaji}</p>

	                <button onclick="speak('${w.romaji}')">
	                    🔊 Speak
	                </button>
	            </div>
	        `;
	    });

	    html += `</div>`;

	    contentArea.insertAdjacentHTML("beforeend", html);
	}
	
	
	
	
	
	
	
	
	
	
    // Fetch lesson from API
    function fetchLessonContent() {
        showLoading();
        
        const apiUrl = `/lesson/get/${lessonId}`;
        
        fetch(apiUrl, {
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
                    throw new Error("Lesson not found");
                } else {
                    throw new Error(`Server error: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(lessonData => {
            renderLesson(lessonData);
			
			
			loadLessonWords(lessonId);
			
        })
        .catch(error => {
            console.error("Lesson fetch error:", error);
            let userMessage = "Unable to load lesson content.";
            if (error.message.includes("Unauthorized")) {
                userMessage = "Your session has expired or is invalid. Please login again.";
            } else if (error.message.includes("not found")) {
                userMessage = "The requested lesson does not exist.";
            } else if (error.message.includes("Network") || error.message.includes("fetch")) {
                userMessage = "Network error. Please check your connection and server status.";
            } else {
                userMessage = error.message;
            }
            showError("Failed to Load Lesson", userMessage, true, true);
        });
    }
    
    // ======================= VALIDATION & INIT =======================
    
    // Check if lesson ID exists
    if (!lessonId) {
        showError(
            "No Lesson Selected", 
            "Please select a lesson from the dashboard first.",
            false,
            true
        );
    }
    // Check authentication token
    else if (!token) {
        showError(
            "Authentication Required", 
            "Please login to access lesson content.",
            false,
            false
        );
        // Add custom login button
        const container = document.getElementById("lessonContentArea");
        const loginBtn = document.createElement("button");
        loginBtn.className = "btn-retry";
        loginBtn.textContent = "Go to Login";
        loginBtn.style.marginTop = "1rem";
        loginBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/login.html";
        });
        const existingDiv = container.querySelector(".error-state div:last-child");
        if (existingDiv) {
            existingDiv.appendChild(loginBtn);
        }
    }
    // All good, fetch lesson
    else {
        fetchLessonContent();
    }
    
    // ======================= NAVIGATION & ACTIONS =======================
    function goToDashboard() {
        window.location.href = "/dashboard.html";
    }
    
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("lessonId");
        localStorage.removeItem("quizId");
        window.location.href = "/login.html";
    }
    
    // Attach event listeners to navigation buttons after DOM is ready
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
    window.goToDashboard = goToDashboard;
    window.logout = logout;
})();



