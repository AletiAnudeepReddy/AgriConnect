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
    const rating = localStorage.getItem("laborerRating") || "0";
    const laborerId = localStorage.getItem("laborerId");
    

    // Display laborer info
    if (nameEl) nameEl.textContent = name;
    if (workTypeEl) workTypeEl.textContent = workType;
    if (experienceEl) experienceEl.textContent = experience;
    if (locationEl) locationEl.textContent = location;

    // Menu toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    // Fetch jobs
    async function fetchJobs() {
        try {
            const response = await fetch("http://localhost:8000/jobs/all");
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
            const jobs = await response.json();
            displayJobs(jobs);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            jobListingsContainer.innerHTML = "<p>Unable to load jobs. Try again later.</p>";
        }
    }

    // Display jobs with Apply button
    function displayJobs(jobs) {
        jobListingsContainer.innerHTML = "<h2>Available Jobs</h2>";

        if (!jobs || jobs.length === 0) {
            jobListingsContainer.innerHTML += "<p>No jobs available right now.</p>";
            return;
        }

        jobs.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");

            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Date:</strong> ${new Date(job.date).toLocaleDateString()}</p>
                <p><strong>Timings:</strong> ${job.timings}</p>
                <p><strong>Wages:</strong> ₹${job.wages}/day</p>
                <p><strong>Workers Required:</strong> ${job.workers_required}</p>
                <button class="apply-btn"><i class="fas fa-paper-plane"></i> Apply</button>
            `;

            const applyBtn = jobCard.querySelector(".apply-btn");

            // Attach apply event with job._id and job.farmerId
            applyBtn.addEventListener("click", () => {
                const farmerId = job.farmer_id?._id;
                if (!farmerId) {
                    alert("Farmer information not available for this job.");
                    return;
                }
                applyForJob(job._id, farmerId, applyBtn);
            });

            jobListingsContainer.appendChild(jobCard);
        });
    }

    // Apply logic
    
    async function applyForJob(jobId, farmerId, buttonElement) {
        if (!name || !experience || !location) {
            alert("Laborer details missing. Please log in again.");
            return;
        }

        const applicationData = {
            fullName: name,
            experience: experience,
            location: location,
            rating: isNaN(parseFloat(rating)) ? 0 : parseFloat(rating),
            jobId: jobId,
            farmerId: farmerId,
            laborerId: laborerId,
            status: "Pending"
        };

        try {
            const response = await fetch("http://localhost:8000/api/applicants/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(applicationData)
            });

            if (response.ok) {
                alert("Successfully applied for the job!");
                buttonElement.textContent = "Applied";
                buttonElement.disabled = true;
            } else {
                const error = await response.json();
                alert(`Failed to apply: ${error.message}`);
            }
        } catch (err) {
            console.error("Error applying:", err);
            alert("Error applying. Try again later.");
        }
    }

    // Start
    fetchJobs();
});
