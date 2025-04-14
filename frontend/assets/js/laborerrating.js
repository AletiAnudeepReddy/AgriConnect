document.addEventListener("DOMContentLoaded", function () {
    // Handle tab switching
    const tabs = document.querySelectorAll("nav ul li");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.getAttribute("data-tab")).classList.add("active");
        });
    });

    // Handle star rating selection
    document.querySelectorAll(".stars").forEach(starContainer => {
        const stars = starContainer.querySelectorAll(".star");
        stars.forEach(star => {
            star.addEventListener("click", function () {
                stars.forEach(s => s.classList.remove("active"));
                this.classList.add("active");
                let ratingValue = this.getAttribute("data-value");
                console.log("Rating Given: ", ratingValue);
            });
        });
    });
    const farmers = [
        { id: 1, name: "Surya" },
        { id: 2, name: "Prakash" }
    ];

    const reviews = [
        { farmer: "Mahesh", rating: 5, comment: "Hardworking laborer, very punctual." },
        { farmer: "Ramesh", rating: 4, comment: "Good work, but needs improvement in speed." }
    ];

    // 🌟 Dynamically Load Farmers for Rating
    // 🌟 Dynamically Load Farmers for Rating from AcceptedFarmers collection
async function loadFarmers() {
    const container = document.getElementById("farmerRatings");
    container.innerHTML = ""; 

    const laborerId = localStorage.getItem("laborerId");
    console.log(laborerId);

    try {
        const res = await fetch(`http://localhost:8000/api/accepted-farmers/${laborerId}`);
        
        
        const response = await res.json();
        const acceptedFarmers = response.data;
        if (!acceptedFarmers || acceptedFarmers.length === 0) {
            container.innerHTML = "<p>No farmers to rate yet.</p>";
            return;
        }
        acceptedFarmers.forEach(farmer => {
            container.innerHTML += `
                <div class="farmer">
                    <h3><i class="fas fa-user"></i> ${farmer.farmerFullName}</h3>
                    <div class="stars" data-farmer="${farmer.farmerId}">
                        <span class="star" data-value="1">★</span>
                        <span class="star" data-value="2">★</span>
                        <span class="star" data-value="3">★</span>
                        <span class="star" data-value="4">★</span>
                        <span class="star" data-value="5">★</span>
                    </div>
                    <textarea placeholder="Leave a comment on ${farmer.farmerFullName}'s behavior..."></textarea>
                    <button class="submit-rating" data-farmer="${farmer.farmerId}" data-job="${farmer.jobId}">
                        <i class="fas fa-paper-plane"></i> Submit Rating
                    </button>
                </div>
            `;
        });

        attachStarListeners(); // Reattach star selection events after loading
        attachRatingSubmitListeners();

    } catch (error) {
        console.error("Error fetching accepted farmers:", error);
        container.innerHTML = "<p>Failed to load farmers. Please try again later.</p>";
    }
}

function attachStarListeners() {
    document.querySelectorAll(".stars").forEach(starContainer => {
        const stars = starContainer.querySelectorAll(".star");
        stars.forEach((star, index) => {
            star.addEventListener("click", function () {
                const selectedValue = parseInt(this.getAttribute("data-value"));

                // Fill all stars up to the selected one
                stars.forEach(s => {
                    const starValue = parseInt(s.getAttribute("data-value"));
                    if (starValue <= selectedValue) {
                        s.classList.add("active");
                    } else {
                        s.classList.remove("active");
                    }
                });

                console.log("Rating Given:", selectedValue);
            });
        });
    });
}
function attachRatingSubmitListeners() {
    document.querySelectorAll(".submit-rating").forEach(button => {
        button.addEventListener("click", async function () {
            const farmerId = this.getAttribute("data-farmer");
            console.log(farmerId);
            const jobCard = this.closest(".farmer");
            
            const stars = jobCard.querySelectorAll(".star.active");
            console.log(stars);
            const comment = jobCard.querySelector("textarea").value.trim();
            console.log(comment);
            const jobId = this.getAttribute("data-job") || "not-required"; // Optional if you use jobId in button dataset
            console.log(jobId);
            const laborerId = localStorage.getItem("laborerId");
            console.log(laborerId);

            if (stars.length === 0) {
                alert("Please select a rating before submitting.");
                return;
            }

            const rating = stars.length;

            const payload = {
                laborerId,
                laborerName: localStorage.getItem("laborerName") || "Anonymous",
                farmerId,
                jobId,
                rating,
                comment
            };

            try {
                const res = await fetch("http://localhost:8000/api/farmer-ratings/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    throw new Error("Failed to submit rating.");
                }

                // ✅ Delete the accepted farmer entry
                await fetch(`http://localhost:8000/api/accepted-farmer/job/${jobId}`, {
                    method: "DELETE"
                });

                // ✅ Remove the UI block after successful submission
                jobCard.remove();
                alert("Rating submitted and accepted farmer deleted.");

            } catch (error) {
                console.error("Error submitting rating:", error);
                alert("Error submitting rating. Please try again.");
            }
        });
    });
}



    // 🌟 Dynamically Load Reviews
    const laborerId = localStorage.getItem("laborerId"); // 👈 Make sure this is stored at login

async function loadReviewsFromBackend() {
    try {
        const res = await fetch(`http://localhost:8000/api/ratings/by-laborer/${laborerId}`);
        const data = await res.json();
        
        const container = document.getElementById("userReviews");
        container.innerHTML = '<h3><i class="fas fa-comment-dots"></i> Reviews from Farmers</h3>';

        if (!data || data.length === 0) {
            container.innerHTML += "<p>No reviews available yet.</p>";
            return;
        }

        const ratingStats = [0, 0, 0, 0, 0]; // Index 0 = 1 star, index 4 = 5 star
        let total = 0;

        data.forEach(review => {
            const { rating, comment, farmerName } = review;
            ratingStats[rating - 1]++;
            total += rating;

            const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
            container.innerHTML += `
                <div class="review">
                    <h4><i class="fas fa-user"></i> ${farmerName} <span class="stars">${stars}</span></h4>
                    <p><i class="fas fa-comment-alt"></i> ${comment}</p>
                </div>
            `;
        });

        const count = data.length;
        const overallRating = (total / count).toFixed(1);
        document.querySelector(".rating-score").innerText = overallRating;

        const bars = document.querySelectorAll(".rating-bar");
        ratingStats.reverse().forEach((countPerStar, index) => {
            const percentage = Math.round((countPerStar / count) * 100);
            const barFill = bars[index].querySelector(".fill");
            const percentText = bars[index].lastElementChild;

            barFill.style.width = `${percentage}%`;
            percentText.innerText = `${percentage}%`;
        });

    } catch (err) {
        console.error("Error fetching reviews:", err);
    }
}


    // 🌟 Run the functions to load data
    loadFarmers();
    loadReviewsFromBackend();

});
