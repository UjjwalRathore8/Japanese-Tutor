/*
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login.html";
}

fetch("/Result/top", {
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(res => res.json())
.then(data => {
    console.log("LEADERBOARD DATA:", data);

    const leaderboardDiv = document.getElementById("leaderboard");

    if (!data || data.length === 0) {
        leaderboardDiv.innerHTML = "No leaderboard data found.";
        return;
    }

    let html = "<ol>";
	data.forEach(result => {
	    html += `
			<li>
			    ${result.name} (${result.email}) - Score: ${result.score}
			</li>
	    `;
	});
    html += "</ol>";
    leaderboardDiv.innerHTML = html;
})
.catch(err => {
    console.error(err);
    document.getElementById("leaderboard").innerHTML = "Failed to load leaderboard.";
});

*/


(function () {

    const container =
        document.getElementById("leaderboardContainer");

    const token =
        localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    function showLoading() {

        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading rankings...</p>
            </div>
        `;
    }

    function showEmpty() {

        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">
                    👥
                </div>
                <p>No leaderboard data found</p>
                <p style="font-size: 0.75rem; margin-top: 0.3rem;">
                    Scores will appear once users attempt quizzes
                </p>
            </div>
        `;
    }

    function showError(msg) {

        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 2rem;">⚠️</div>
                <p style="color: #b91c1c;">${msg}</p>
            </div>
        `;
    }

    function escapeHtml(str) {

        if (!str) return "";

        return str.replace(/[&<>]/g, function (m) {

            if (m === "&") return "&amp;";
            if (m === "<") return "&lt;";
            if (m === ">") return "&gt;";

            return m;
        });
    }

    function renderLeaderboard(users) {

        const validUsers = users.filter(user => {

            return user &&
                user.name &&
                user.name.trim() !== "" &&
                typeof user.score === "number" &&
                !isNaN(user.score);
        });

        if (validUsers.length === 0) {
            showEmpty();
            return;
        }

        validUsers.sort((a, b) => b.score - a.score);

        let html = `<div class="leaderboard-list">`;

        validUsers.forEach(user => {

            html += `
                <div class="leaderboard-item">
                    <div class="user-info">
                        <div class="user-name">
                            ${escapeHtml(user.name)}
                        </div>

                        <div class="user-email">
                            ${escapeHtml(user.email || "")}
                        </div>
                    </div>

                    <div class="score">
                        ${user.score} pts
                    </div>
                </div>
            `;
        });

        html += `</div>`;

        container.innerHTML = html;
    }

    async function fetchLeaderboard() {

        showLoading();

        try {

            const res = await fetch("/Result/top", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!res.ok) {
                throw new Error("Failed to load leaderboard");
            }

            const data = await res.json();

            renderLeaderboard(data);

        } catch (err) {

            console.error(err);

            showError("Failed to load leaderboard.");
        }
    }

    fetchLeaderboard();

})();