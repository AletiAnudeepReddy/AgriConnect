const container = document.getElementById("applicants-list");
const farmerId = localStorage.getItem("farmerId"); // Set during login

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
                        <button class="accept-btn" data-id="${applicant._id}" data-laborerid="${applicant.laborerId}" data-jobid="${applicant.jobId}" data-name="${applicant.fullName}">
                            <i class="fas fa-check-circle"></i> Accept
                        </button>
                        <button class="reject-btn" data-id="${applicant._id}">
                            <i class="fas fa-times-circle"></i> Reject
                        </button>
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

// Handle Accept, Reject, and Sentiment buttons
document.addEventListener("click", async function (e) {
    // Accept or Reject logic
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

                // If accepted, also store in AcceptedLaborer table
                if (isAccept) {
                    const laborerId = button.dataset.laborerid;
                    const jobId = button.dataset.jobid;
                    const laborerName = button.dataset.name;

                    const addRes = await fetch("http://localhost:8000/api/accepted/add", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            farmerId,
                            jobId,
                            laborerId,
                            laborerName
                        })
                    });

                    const addResult = await addRes.json();

                    if (addRes.status === 201) {
                        console.log("Accepted laborer added.");
                    } else if (addRes.status === 409) {
                        console.warn("Duplicate entry: " + addResult.message);
                    } else {
                        console.error("Error adding accepted laborer:", addResult.message);
                    }
                }

            } else {
                const err = await res.json();
                alert("Error updating status: " + err.message);
            }
        } catch (error) {
            console.error("Status update error:", error);
        }
    }

    // Sentiment Analysis Simulation
    if (e.target.closest(".analyze-btn")) {
        const btn = e.target.closest(".analyze-btn");
        const resultBox = btn.nextElementSibling;
        resultBox.textContent = "Analyzing...";
        resultBox.style.color = "#999";

        const card = btn.closest(".applicant-card");
const laborerId = card.querySelector(".accept-btn")?.dataset.laborerid;

try {
    const res = await fetch(`http://localhost:8000/api/sentiment/laborer/${laborerId}`);
    const data = await res.json();

    resultBox.textContent = `Sentiment: ${data.sentiment}`;
    resultBox.style.color =
        data.sentiment.includes("Good") ? "green" :
        data.sentiment.includes("Bad") ? "red" :
        "#e67e22";
} catch (err) {
    console.error("Sentiment fetch error:", err);
    resultBox.textContent = "Error analyzing sentiment.";
    resultBox.style.color = "gray";
}

    }
});

fetchApplicants(); // Initial load
