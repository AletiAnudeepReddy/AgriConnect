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


    const laborers = [
        { id: 1, name: "Raju" },
        { id: 2, name: "Venkatesh" }
    ];

    const reviews = [
        { laborer: "Kishore", rating: 5, comment: "Very polite farmer. Paid wages on time." },
        { laborer: "Manoj", rating: 4, comment: "Good experience, but needs better work scheduling." }
    ];

    // 🌟 Dynamically Load Laborers for Rating
    function loadLaborers() {
        const container = document.getElementById("laborerRatings");
        container.innerHTML = ""; 
        
        laborers.forEach(laborer => {
            container.innerHTML += `
                <div class="laborer">
                    <h3><i class="fas fa-user"></i> ${laborer.name}</h3>
                    <div class="stars" data-laborer="${laborer.id}">
                        <span class="star" data-value="1">★</span>
                        <span class="star" data-value="2">★</span>
                        <span class="star" data-value="3">★</span>
                        <span class="star" data-value="4">★</span>
                        <span class="star" data-value="5">★</span>
                    </div>
                    <textarea placeholder="Leave a comment on ${laborer.name}'s work..."></textarea>
                    <button class="submit-rating" data-laborer="${laborer.id}">
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
                    <h4><i class="fas fa-user"></i> ${review.laborer} <span class="stars">${stars}</span></h4>
                    <p><i class="fas fa-comment-alt"></i> ${review.comment}</p>
                </div>
            `;
        });
    }

    // 🌟 Run the functions to load data
    loadLaborers();
    loadReviews();
});
