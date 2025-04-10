document.addEventListener("DOMContentLoaded", async function () {
    const farmerId = localStorage.getItem("farmerId");
    const farmerName = localStorage.getItem("farmerName");

    if (!farmerId || !farmerName) {
        alert("Farmer not logged in properly. Please log in again.");
        return;
    }

    // Load accepted laborers
    async function loadAcceptedLaborers() {
        try {
            const res = await fetch(`http://localhost:8000/api/accepted/accepted-laborers/by-farmer/${farmerId}`);
            const laborers = await res.json();
            renderLaborerRatingUI(laborers);
        } catch (err) {
            console.error("Failed to load accepted laborers", err);
        }
    }

    // Render UI for each laborer
    function renderLaborerRatingUI(laborers) {
        const container = document.getElementById("laborerRatings");
        container.innerHTML = "";

        laborers.forEach(laborer => {
            const id = laborer.laborerId._id;
            const name = laborer.laborerId.fullName || laborer.laborerName;
            const jobId = laborer.jobId?._id || laborer.jobId;

            const card = document.createElement("div");
            card.classList.add("laborer");

            card.innerHTML = `
                <h3><i class="fas fa-user"></i> ${name}</h3>
                <div class="stars" data-laborer="${id}" data-job="${jobId}">
                    ${[1, 2, 3, 4, 5].map(val => `<span class="star" data-value="${val}">★</span>`).join("")}
                </div>
                <textarea placeholder="Leave a comment..."></textarea>
                <button class="submit-rating" data-laborer="${id}" data-job="${jobId}" data-name="${name}">
                    <i class="fas fa-paper-plane"></i> Submit Rating
                </button>
            `;
            container.appendChild(card);
        });

        setupRatingSubmission();
    }

    // Star click + Submit rating logic
    function setupRatingSubmission() {
        document.querySelectorAll(".stars").forEach(starContainer => {
            const stars = starContainer.querySelectorAll(".star");
            stars.forEach(star => {
                star.addEventListener("click", function () {
                    const value = parseInt(this.dataset.value);
                    stars.forEach(s => s.classList.remove("active"));
                    for (let i = 0; i < value; i++) {
                        stars[i].classList.add("active");
                    }
                    starContainer.setAttribute("data-rating", value);
                });
            });
        });

        document.querySelectorAll(".submit-rating").forEach(btn => {
            btn.addEventListener("click", async function () {
                const laborerId = this.dataset.laborer;
                const jobId = this.dataset.job;
                const laborerName = this.dataset.name;
                const parent = this.closest(".laborer");
                const rating = parent.querySelector(".stars").dataset.rating;
                const comment = parent.querySelector("textarea").value.trim();

                if (!rating) {
                    alert("Please select a rating before submitting.");
                    return;
                }

                try {
                    // Duplicate rating check
                    const checkRes = await fetch(`http://localhost:8000/api/ratings/check?farmerId=${farmerId}&laborerId=${laborerId}&jobId=${jobId}`);
                    const checkData = await checkRes.json();

                    if (checkData.exists) {
                        alert("You have already submitted a rating for this laborer and job.");
                        parent.remove(); // Optionally remove card
                        return;
                    }

                    // Submit new rating
                    const res = await fetch("http://localhost:8000/api/ratings/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            farmerId,
                            farmerName,
                            laborerId,
                            laborerName,
                            jobId,
                            rating,
                            comment
                        }),
                    });

                    const result = await res.json();
                    if (res.ok) {
                        alert("Rating submitted successfully!");
                        parent.remove(); // Remove card after submission
                    } else {
                        alert(result.message || "Error submitting rating.");
                    }
                } catch (error) {
                    console.error("Submit error:", error);
                    alert("Failed to submit rating.");
                }
            });
        });
    }

    loadAcceptedLaborers();
});
