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
    function loadFarmers() {
        const container = document.getElementById("farmerRatings");
        container.innerHTML = ""; 
        
        farmers.forEach(farmer => {
            container.innerHTML += `
                <div class="farmer">
                    <h3><i class="fas fa-user"></i> ${farmer.name}</h3>
                    <div class="stars" data-farmer="${farmer.id}">
                        <span class="star" data-value="1">★</span>
                        <span class="star" data-value="2">★</span>
                        <span class="star" data-value="3">★</span>
                        <span class="star" data-value="4">★</span>
                        <span class="star" data-value="5">★</span>
                    </div>
                    <textarea placeholder="Leave a comment on ${farmer.name}'s behavior..."></textarea>
                    <button class="submit-rating" data-farmer="${farmer.id}">
                        <i class="fas fa-paper-plane"></i> Submit Rating
                    </button>
                </div>
            `;
        });
    }

    // 🌟 Dynamically Load Reviews
    function loadReviews() {
        const container = document.getElementById("userReviews");
        reviews.forEach(review => {
            const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
            container.innerHTML += `
                <div class="review">
                    <h4><i class="fas fa-user"></i> ${review.farmer} <span class="stars">${stars}</span></h4>
                    <p><i class="fas fa-comment-alt"></i> ${review.comment}</p>
                </div>
            `;
        });
    }

    // 🌟 Run the functions to load data
    loadFarmers();
    loadReviews();
});
