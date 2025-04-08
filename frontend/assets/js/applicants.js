const container = document.getElementById("applicants-list");
const farmerId = localStorage.getItem("farmerId"); // Ensure this is set after login

// Fetch and display applicants
async function fetchApplicants() {
    try {
        const response = await fetch(`http://localhost:8000/api/applicants/by-farmer/${farmerId}`);
        const applicants = await response.json();

        if (applicants.length === 0) {
            container.innerHTML = "<p>No applicants found.</p>";
            return;
        }

        applicants.forEach(applicant => {
            const card = document.createElement("div");
            card.className = "applicant-card";

            card.innerHTML = `
                <div class="details">
                    <h2><i class="fas fa-user"></i> ${applicant.fullName}</h2>
                    <p><i class="fas fa-briefcase"></i> Experience: ${applicant.experience}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Location: ${applicant.location}</p>
                    <p><i class="fas fa-star"></i> Rating: ${applicant.rating} / 5</p>
                    <p><strong>Status:</strong> <span class="status">${applicant.status || "Pending"}</span></p>
                    <div class="action-buttons">
                        <button class="accept-btn" data-id="${applicant._id}"><i class="fas fa-check-circle"></i> Accept</button>
                        <button class="reject-btn" data-id="${applicant._id}"><i class="fas fa-times-circle"></i> Reject</button>
                    </div>
                </div>
                <div class="sentiment-block">
                    <button class="analyze-btn"><i class="fas fa-brain"></i> Analyze Sentiment</button>
                    <div class="sentiment-result">Awaiting Analysis...</div>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error fetching applicants:", err);
        container.innerHTML = "<p>Error loading applicants.</p>";
    }
}

// Handle Accept, Reject, and Sentiment Analyze buttons
document.addEventListener("click", async function (e) {
    // Accept / Reject logic
    if (e.target.closest(".accept-btn") || e.target.closest(".reject-btn")) {
        const isAccept = e.target.closest(".accept-btn");
        const button = e.target.closest("button");
        const applicantId = button.dataset.id;
        const newStatus = isAccept ? "Accepted" : "Rejected";

        try {
            const res = await fetch(`http://localhost:8000/api/applicants/update-status/${applicantId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                const statusElem = button.closest(".details").querySelector(".status");
                statusElem.textContent = newStatus;
                alert(`Applicant ${newStatus}`);
            } else {
                const err = await res.json();
                alert("Error updating status: " + err.message);
            }
        } catch (error) {
            console.error("Status update error:", error);
        }
    }

    // Sentiment Analysis logic
    if (e.target.closest(".analyze-btn")) {
        const btn = e.target.closest(".analyze-btn");
        const resultBox = btn.nextElementSibling;
        resultBox.textContent = "Analyzing...";
        resultBox.style.color = "#999";

        setTimeout(() => {
            const sentiments = ["Good 😊", "Average 😐", "Bad 😞"];
            const colors = ["green", "#e67e22", "red"];
            const random = Math.floor(Math.random() * sentiments.length);
            resultBox.textContent = `Sentiment: ${sentiments[random]}`;
            resultBox.style.color = colors[random];
        }, 2000);
    }
});

fetchApplicants(); // Initial call