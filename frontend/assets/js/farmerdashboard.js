document.addEventListener("DOMContentLoaded", function () {
    const nameElement = document.getElementById("farmer-name");
    const jobListingsContainer = document.querySelector(".job-listings");
    const jobForm = document.querySelector(".job-form form");

    const farmerId = localStorage.getItem("farmerId");
    const farmerName = localStorage.getItem("farmerName");

    // Show farmer name
    if (farmerName && nameElement) {
        nameElement.textContent = farmerName;
    }

    // Logout
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "loginfarmer.html";
        });
    }

    // Menu toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Fetch & display jobs
    async function fetchJobs() {
        try {
            const res = await fetch(`http://localhost:8000/jobs/farmer/${farmerId}`);
            const jobs = await res.json();

            jobListingsContainer.innerHTML = ""; // Clear existing

            jobs.forEach(job => {
                const jobCard = createJobCard(job);
                jobListingsContainer.appendChild(jobCard);
            });

        } catch (err) {
            console.error("Error fetching jobs:", err);
        }
    }

    // Helper to create a job card
    function createJobCard(job) {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
        jobCard.innerHTML = `
    <h3>${job.title}</h3>
    <p>📍 Location: ${job.location}</p>
    <p>💰 Wages: ₹${job.wages}/day</p>
    <p>📅 Date: ${job.date}</p>
    <p>⏰ Time: ${job.timings}</p>
    <p>👷 Workers Required: ${job.workers_required}</p>
    <div class="job-actions">
        <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
        <button class="complete-btn"><i class="fas fa-check-circle"></i> Completed</button>
    </div>
`;

        // Delete functionality
        jobCard.querySelector(".delete-btn").addEventListener("click", async () => {
            try {
                const response = await fetch(`http://localhost:8000/jobs/${job._id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    jobCard.remove();
                } else {
                    alert("Failed to delete job");
                }
            } catch (err) {
                console.error("Delete error:", err);
            }
        });

        return jobCard;
    }

    // Submit job post
    jobForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const jobData = {
            farmer_id: farmerId,
            title: document.getElementById("jobName").value,
            location: document.getElementById("jobLocation").value,
            date: document.getElementById("jobDate").value,
            timings: `${document.getElementById("jobTimeFrom").value} - ${document.getElementById("jobTimeTo").value}`,
            wages: parseInt(document.getElementById("jobWages").value),
            workers_required: parseInt(document.getElementById("numWorkers").value)
        };

        try {
            const res = await fetch("http://localhost:8000/jobs/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobData)
            });

            if (res.ok) {
                const data = await res.json();
                const jobCard = createJobCard(data.job);
                jobListingsContainer.appendChild(jobCard);
                jobForm.reset();
            } else {
                alert("Failed to create job");
            }
        } catch (err) {
            console.error("Job post error:", err);
        }
    });

    // Initial fetch
    if (farmerId) fetchJobs();
    jobCard.querySelector(".complete-btn").addEventListener("click", () => {
        jobCard.classList.add("completed");
        jobCard.querySelector(".complete-btn").disabled = true;
        jobCard.querySelector(".complete-btn").innerHTML = `<i class="fas fa-check-circle"></i> Done`;
    });
    
});
