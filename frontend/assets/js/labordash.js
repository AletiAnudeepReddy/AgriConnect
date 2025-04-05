document.addEventListener("DOMContentLoaded", function () {
    const nameEl = document.getElementById("laborer-name");
    const workTypeEl = document.getElementById("laborer-work-type");
    const experienceEl = document.getElementById("laborer-experience");
    const locationEl = document.getElementById("laborer-location");
    const jobListingsContainer = document.querySelector(".job-listings");

    // Retrieve laborer details from localStorage
    const name = localStorage.getItem("laborerName") || "Laborer";
    const workType = localStorage.getItem("laborerWorkType") || "N/A";
    const experience = localStorage.getItem("laborerExperience") || "0";
    const location = localStorage.getItem("laborerLocation") || "Unknown";

    // Display laborer details
    if (nameEl) nameEl.textContent = name;
    if (workTypeEl) workTypeEl.textContent = workType;
    if (experienceEl) experienceEl.textContent = experience;
    if (locationEl) locationEl.textContent = location;

    // Menu toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Function to fetch job listings from the backend
    async function fetchJobs() {
        try {
            const response = await fetch("http://localhost:8000/jobs/all"); 
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jobs = await response.json();
            displayJobs(jobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            jobListingsContainer.innerHTML = "<p>Failed to load job listings. Please try again later.</p>";
        }
    }

    // Function to display jobs dynamically
    function displayJobs(jobs) {
        jobListingsContainer.innerHTML = "<h2>Available Jobs</h2>"; // Clear existing job listings
        if (jobs.length === 0) {
            jobListingsContainer.innerHTML += "<p>No jobs available at the moment.</p>";
            return;
        }

        jobs.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
            jobCard.setAttribute("data-job-id", job.id);

            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Location:</strong> <span class="job-location">${job.location}</span></p>
                <p><strong>Date:</strong> ${new Date(job.date).toLocaleDateString()}</p>
                <p><strong>Timings:</strong> ${job.timings}</p>
                <p><strong>Wages:</strong> ₹${job.wages}/day</p>
                <p><strong>Workers Required:</strong> ${job.workers_required}</p>
                <button class="apply-btn"><i class="fas fa-paper-plane"></i> Apply</button>
            `;

            // Attach event listener for the apply button
            

            jobListingsContainer.appendChild(jobCard);
        });
    }

    // Function to handle job application
    async function applyForJob(jobId) {
        const laborerId = localStorage.getItem("laborerId"); // Assuming laborerId is stored in localStorage
        if (!laborerId) {
            alert("Please log in to apply for jobs.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ laborerId }),
            });

            if (response.ok) {
                alert("Successfully applied for the job!");
            } else {
                const errorData = await response.json();
                alert(`Failed to apply: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error applying for job:", error);
            alert("An error occurred while applying. Please try again later.");
        }
    }

    // Fetch and display jobs on page load
    fetchJobs();
});
