document.addEventListener("DOMContentLoaded", function () {
    const jobListingsContainer = document.getElementById("job-listings");
    const loadingText = document.getElementById("loading");

    const laborerId = localStorage.getItem("laborerId");
    const laborerName = localStorage.getItem("laborerName");
    const experience = localStorage.getItem("laborerExperience");
    const location = localStorage.getItem("laborerLocation");
    const rating = parseFloat(localStorage.getItem("laborerRating")) || 0;

    async function fetchJobsAndApplications() {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                fetch("http://localhost:8000/jobs/all"),
                fetch(`http://localhost:8000/api/applicants/by-laborer/${laborerId}`)
            ]);

            if (!jobsRes.ok || !appsRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const jobs = await jobsRes.json();
            const applications = await appsRes.json();

            const appliedMap = {};
            applications.forEach(app => {
                appliedMap[app.jobId] = true;
            });

            loadingText.remove(); // Remove loading

            if (jobs.length === 0) {
                jobListingsContainer.innerHTML += "<p>No jobs available at the moment.</p>";
                return;
            }

            jobs.forEach(job => {
                const jobCard = document.createElement("div");
                jobCard.className = "job-card";

                const isApplied = appliedMap[job._id];

                jobCard.innerHTML = `
                    <h3>${job.title}</h3>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Date:</strong> ${new Date(job.date).toLocaleDateString()}</p>
                    <p><strong>Timings:</strong> ${job.timings}</p>
                    <p><strong>Wages:</strong> ₹${job.wages}</p>
                    <p><strong>Workers Required:</strong> ${job.workers_required}</p>
                    <button class="apply-btn" ${isApplied ? "disabled" : ""}>
                        <i class="fas fa-paper-plane"></i> ${isApplied ? "Pending" : "Apply"}
                    </button>
                `;

                const applyBtn = jobCard.querySelector(".apply-btn");

                if (!isApplied) {
                    applyBtn.addEventListener("click", async () => {
                        const applicationData = {
                            fullName: laborerName,
                            experience,
                            location,
                            rating,
                            jobId: job._id,
                            farmerId: job.farmer_id._id,
                            laborerId,
                            status: "Pending"
                        };

                        try {
                            const res = await fetch("http://localhost:8000/api/applicants/apply", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(applicationData)
                            });

                            if (res.ok) {
                                alert("Successfully applied!");
                                applyBtn.textContent = "Pending";
                                applyBtn.disabled = true;
                            } else {
                                const err = await res.json();
                                alert(`Failed to apply: ${err.message}`);
                            }
                        } catch (err) {
                            console.error("Error:", err);
                            alert("Something went wrong. Try again later.");
                        }
                    });
                }

                jobListingsContainer.appendChild(jobCard);
            });

            // Optional: View More Button
            const viewMoreBtn = document.createElement("button");
            viewMoreBtn.className = "view-more-btn";
            viewMoreBtn.innerHTML = '<i class="fas fa-angle-down"></i> View More Jobs';
            viewMoreBtn.addEventListener("click", () => {
                alert("Load more jobs functionality to be implemented!");
            });
            jobListingsContainer.appendChild(viewMoreBtn);

        } catch (err) {
            console.error("Error fetching jobs or applications:", err);
            loadingText.textContent = "Failed to load jobs. Try again later.";
        }
    }

    fetchJobsAndApplications();

    window.applyFilters = function () {
        alert("Filters applied! (Functionality to be implemented)");
    };
});
