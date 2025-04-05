document.addEventListener("DOMContentLoaded", function () {
    const jobListingsContainer = document.getElementById("job-listings");
    const loadingText = document.getElementById("loading");

    async function fetchJobs() {
        try {
            const response = await fetch("http://localhost:8000/jobs/all"); // Replace with your actual API URL
            if (!response.ok) {
                throw new Error("Failed to fetch jobs");
            }

            const jobs = await response.json();
            loadingText.remove(); // Remove loading text

            if (jobs.length === 0) {
                jobListingsContainer.innerHTML += "<p>No jobs available at the moment.</p>";
                return;
            }

            jobs.forEach(job => {
                const jobCard = document.createElement("div");
                jobCard.className = "job-card";

                jobCard.innerHTML = `
                    <h3>${job.title}</h3>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Date:</strong> ${new Date(job.date).toLocaleDateString()}</p>
                    <p><strong>Timings:</strong> ${job.timings}</p>
                    <p><strong>Wages:</strong> ₹${job.wages}</p>
                    <p><strong>Workers Required:</strong> ${job.workers_required}</p>
                    <button class="apply-btn"><i class="fas fa-paper-plane"></i> Apply</button>
                `;

                jobListingsContainer.appendChild(jobCard);
            });

            // Add a View More button
            const viewMoreBtn = document.createElement("button");
            viewMoreBtn.className = "view-more-btn";
            viewMoreBtn.innerHTML = '<i class="fas fa-angle-down"></i> View More Jobs';
            viewMoreBtn.addEventListener("click", () => {
                alert("Load more jobs functionality to be implemented!");
            });
            jobListingsContainer.appendChild(viewMoreBtn);

        } catch (error) {
            console.error("Error fetching jobs:", error);
            loadingText.textContent = "Failed to load jobs. Try again later.";
        }
    }

    fetchJobs();

    window.applyFilters = function () {
        alert("Filters applied! (Functionality to be implemented)");
        // Future: Filter the fetched job data using JS
    }
});