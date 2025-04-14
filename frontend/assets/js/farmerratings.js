document.addEventListener("DOMContentLoaded", async function () {
    const farmerId = localStorage.getItem("farmerId");
    const farmerName = localStorage.getItem("farmerName");

    if (!farmerId || !farmerName) {
        alert("Farmer not logged in properly. Please log in again.");
        return;
    }

    // Tab switching logic
    const tabs = document.querySelectorAll("nav ul li");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            const targetTab = this.dataset.tab;

            // Remove active class from all tabs and content sections
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Add active class to the clicked tab and corresponding content section
            this.classList.add("active");
            document.getElementById(targetTab).classList.add("active");

            // Scroll to "My Reviews" when clicked
            if (targetTab === "reviews") {
                document.getElementById("reviews").scrollIntoView({ behavior: "smooth" });
            }
        });
    });

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

    // Load Farmer Reviews from Backend
    async function loadFarmerReviewsFromBackend() {
        try {
            const res = await fetch(`http://localhost:8000/api/farmer-ratings/by-farmer/${farmerId}`);
            const data = await res.json();

            // Select and reset containers
            const overallRatingEl = document.querySelector(".rating-score");
            const ratingBars = document.querySelectorAll(".rating-bar");
            const reviewsContainer = document.getElementById("userReviews");

            reviewsContainer.innerHTML = '<h3><i class="fas fa-comment-dots"></i> Reviews from Laborers</h3>';

            if (!data || data.length === 0) {
                overallRatingEl.innerText = "N/A";
                ratingBars.forEach(bar => {
                    bar.querySelector(".fill").style.width = "0%";
                    bar.lastElementChild.innerText = "0%";
                });
                reviewsContainer.innerHTML += "<p>No reviews available yet.</p>";
                return;
            }

            const ratingStats = [0, 0, 0, 0, 0]; // Index 0 = 1 star, 4 = 5 star
            let total = 0;

            // Loop through data to accumulate stats and display reviews
            data.forEach(({ rating, comment, laborerName }) => {
                ratingStats[rating - 1]++;
                total += rating;

                const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
                reviewsContainer.innerHTML += `
                    <div class="review">
                        <h4><i class="fas fa-user"></i> ${laborerName} <span class="stars">${stars}</span></h4>
                        <p><i class="fas fa-comment-alt"></i> ${comment}</p>
                    </div>
                `;
            });

            const reviewCount = data.length;
            const overallRating = (total / reviewCount).toFixed(1);
            overallRatingEl.innerText = overallRating;

            // Update rating bars: reverse stats to match 5★ to 1★ order in HTML
            ratingStats.slice().reverse().forEach((countPerStar, index) => {
                const percentage = Math.round((countPerStar / reviewCount) * 100);
                const bar = ratingBars[index];
                bar.querySelector(".fill").style.width = `${percentage}%`;
                bar.lastElementChild.innerText = `${percentage}%`;
            });

        } catch (err) {
            console.error("Error fetching farmer reviews:", err);
        }
    }

    loadAcceptedLaborers();
    loadFarmerReviewsFromBackend();
});
