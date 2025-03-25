document.addEventListener("DOMContentLoaded", function () {
    // Toggle navigation menu for mobile view
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Post Job Button (Modal or Redirect)
    document.querySelectorAll(".post-job-btn, #post-job-btn, #add-job-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".job-form").scrollIntoView({ behavior: "smooth" });
        });
    });

    // Dynamic Year in Footer
    document.getElementById("currentYear").textContent = new Date().getFullYear();

    // Job Posting Form Handling
    const jobForm = document.querySelector(".job-form form");
    const jobListings = document.querySelector(".job-listings");

    jobForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values
        const jobName = document.getElementById("jobName").value;
        const jobLocation = document.getElementById("jobLocation").value;
        const jobWages = document.getElementById("jobWages").value;
        const jobDate = document.getElementById("jobDate").value;

        if (jobName && jobLocation && jobWages && jobDate) {
            // Create job card
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
            jobCard.innerHTML = `
                <h3>${jobName}</h3>
                <p>📍 Location: ${jobLocation}</p>
                <p>💰 Wages: ₹${jobWages}/day</p>
                <p>📅 Date: ${jobDate}</p>
                <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
            `;

            // Append to job listings
            jobListings.appendChild(jobCard);

            // Clear form fields
            jobForm.reset();

            // Add event listeners to new edit and delete buttons
            addEditDeleteListeners(jobCard);
        } else {
            alert("Please fill in all fields!");
        }
    });

    // Function to add edit & delete functionality
    function addEditDeleteListeners(jobCard) {
        // Edit job
        jobCard.querySelector(".edit-btn").addEventListener("click", function () {
            const jobTitle = jobCard.querySelector("h3").textContent;
            const jobLocation = jobCard.querySelector("p:nth-of-type(1)").textContent.replace("📍 Location: ", "");
            const jobWages = jobCard.querySelector("p:nth-of-type(2)").textContent.replace("💰 Wages: ₹", "").replace("/day", "");
            const jobDate = jobCard.querySelector("p:nth-of-type(3)").textContent.replace("📅 Date: ", "");

            // Prefill form
            document.getElementById("jobName").value = jobTitle;
            document.getElementById("jobLocation").value = jobLocation;
            document.getElementById("jobWages").value = jobWages;
            document.getElementById("jobDate").value = jobDate;

            // Remove job from listings
            jobCard.remove();
        });

        // Delete job
        jobCard.querySelector(".delete-btn").addEventListener("click", function () {
            jobCard.remove();
        });
    }

    // Apply event listeners for existing job posts
    document.querySelectorAll(".job-card").forEach(jobCard => addEditDeleteListeners(jobCard));
});
