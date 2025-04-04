document.addEventListener("DOMContentLoaded", function () {
    const nameElement = document.getElementById("farmer-name");
    const storedName = localStorage.getItem("farmerName");

    if (storedName && nameElement) {
        nameElement.textContent = storedName;
    }
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (e) {
            e.preventDefault(); // Prevents default link behavior

            // ✅ Clear stored user data
            localStorage.removeItem("farmerName");

            // ✅ Redirect to the login page
            window.location.href = "loginfarmer.html";
        });
    }
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active"); // Show/Hide menu on click
    });
    const jobForm = document.querySelector(".job-form form");
    const jobListingsContainer = document.querySelector(".job-listings");

    jobForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get input values
        const jobName = document.getElementById("jobName").value;
        const jobLocation = document.getElementById("jobLocation").value;
        const jobWages = document.getElementById("jobWages").value;
        const jobDate = document.getElementById("jobDate").value;
        const jobTimeFrom = document.getElementById("jobTimeFrom").value;
        const jobTimeTo = document.getElementById("jobTimeTo").value;
        const numWorkers = document.getElementById("numWorkers").value;

        // Create job card
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
        jobCard.innerHTML = `
            <h3>${jobName}</h3>
            <p>📍 Location: ${jobLocation}</p>
            <p>💰 Wages: ₹${jobWages}/day</p>
            <p>📅 Date: ${jobDate}</p>
            <p>⏰ Time: ${jobTimeFrom} - ${jobTimeTo}</p>
            <p>👷 Workers Required: ${numWorkers}</p>
            <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
            <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
        `;

        // Append new job to job listings container
        jobListingsContainer.appendChild(jobCard);

        // Reset the form fields after submission
        jobForm.reset();

        // Add event listener for delete button
        jobCard.querySelector(".delete-btn").addEventListener("click", function () {
            jobCard.remove();
        });

        // Add event listener for edit button
        jobCard.querySelector(".edit-btn").addEventListener("click", function () {
            document.getElementById("jobName").value = jobName;
            document.getElementById("jobLocation").value = jobLocation;
            document.getElementById("jobWages").value = jobWages;
            document.getElementById("jobDate").value = jobDate;
            document.getElementById("jobTimeFrom").value = jobTimeFrom;
            document.getElementById("jobTimeTo").value = jobTimeTo;
            document.getElementById("numWorkers").value = numWorkers;
            
            // Remove job card from listing
            jobCard.remove();
        });
    });
});
