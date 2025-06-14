document.addEventListener("DOMContentLoaded", function () {
    const nameEl = document.getElementById("laborer-name");
    const workTypeEl = document.getElementById("laborer-work-type");
    const experienceEl = document.getElementById("laborer-experience");
    const locationEl = document.getElementById("laborer-location");
    const jobListingsContainer = document.querySelector(".job-listings");

    const name = localStorage.getItem("laborerName") || "Laborer";
    const workType = localStorage.getItem("laborerWorkType") || "N/A";
    const experience = localStorage.getItem("laborerExperience") || "0";
    const location = localStorage.getItem("laborerLocation") || "Unknown";
    const rating = localStorage.getItem("laborerRating") || "0";
    const laborerId = localStorage.getItem("laborerId");

    if (nameEl) nameEl.textContent = name;
    if (workTypeEl) workTypeEl.textContent = workType;
    if (experienceEl) experienceEl.textContent = experience;
    if (locationEl) locationEl.textContent = location;

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    async function fetchJobsAndApplications() {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                fetch("http://localhost:8000/jobs/all"),
                fetch(`http://localhost:8000/api/applicants/by-laborer/${laborerId}`)
            ]);
    
            if (!jobsRes.ok || !appsRes.ok) throw new Error("Failed to fetch data");
    
            const jobs = await jobsRes.json();
            const applications = await appsRes.json(); // [{ jobId, status, ... }]
    
            // ✅ Map jobId => status ("Pending", etc.)
            const appliedJobMap = {};
            applications.forEach(app => {
                appliedJobMap[app.jobId] = app.status;
            });
    
            displayJobs(jobs, appliedJobMap);
        } catch (err) {
            console.error("Error loading jobs or applications:", err);
            jobListingsContainer.innerHTML = "<p>Unable to load jobs. Try again later.</p>";
        }
    }

    function displayJobs(jobs, appliedJobMap) {
        jobListingsContainer.innerHTML = "<h2>Available Jobs</h2>";
    
        if (!jobs || jobs.length === 0) {
            jobListingsContainer.innerHTML += "<p>No jobs available right now.</p>";
            return;
        }
    
        jobs.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
    
            const status = appliedJobMap[job._id]; // "Pending" or undefined
            const isApplied = !!status;
    
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Date:</strong> ${new Date(job.date).toLocaleDateString()}</p>
                <p><strong>Timings:</strong> ${job.timings}</p>
                <p><strong>Wages:</strong> ₹${job.wages}/day</p>
                <p><strong>Workers Required:</strong> ${job.workers_required}</p>
                <button class="apply-btn" ${isApplied ? "disabled" : ""}>
                    <i class="fas fa-paper-plane"></i> ${isApplied ? status : "Apply"}
                </button>
            `;
    
            const applyBtn = jobCard.querySelector(".apply-btn");
    
            if (!isApplied) {
                applyBtn.addEventListener("click", () => {
                    const farmerId = job.farmer_id?._id;
                    if (!farmerId) {
                        alert("Farmer information not available for this job.");
                        return;
                    }
                    applyForJob(job._id, farmerId, applyBtn);
                });
            }
    
            jobListingsContainer.appendChild(jobCard);
        });
    }

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(applicationData)
            });

            if (response.ok) {
                alert("Successfully applied for the job!");
                buttonElement.textContent = "Pending";
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

    fetchJobsAndApplications();
});
