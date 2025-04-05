document.addEventListener("DOMContentLoaded", function () {
    const jobForm = document.getElementById("jobForm");
    const jobsContainer = document.getElementById("jobsContainer");

    const farmerId = localStorage.getItem("farmerId");

    // ✅ Fetch and show jobs
    async function fetchJobs() {
        try {
            const res = await fetch(`http://localhost:8000/jobs/farmer/${farmerId}`);
            const jobs = await res.json();
            jobsContainer.innerHTML = ""; // Clear previous

            jobs.forEach(job => {
                const jobCard = createJobCard(job);
                jobsContainer.appendChild(jobCard);
            });
        } catch (err) {
            console.error("Error fetching jobs:", err);
        }
    }

    // ✅ Create job card
    function createJobCard(job) {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job");
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
    <p>📍 Location: ${job.location}</p>
    <p>💰 Wages: ₹${job.wages}/day</p>
    <p>📅 Date: ${job.date}</p>
    <p>⏰ Time: ${job.timings}</p>
    <p>👥 Workers Needed: ${job.workers_required}</p>
    <div class="job-actions">
        <button class="edit-job"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete-job"><i class="fas fa-trash"></i> Delete</button>
        <button class="complete-job"><i class="fas fa-check-circle"></i> Completed</button>
    </div>
        `;

        // ✅ Delete job from DB
        jobCard.querySelector(".delete-job").addEventListener("click", async () => {
            try {
                const res = await fetch(`http://localhost:8000/jobs/${job._id}`, {
                    method: "DELETE"
                });

                if (res.ok) {
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

    // ✅ Submit job to backend
    jobForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const jobData = {
            farmer_id: farmerId,
            title: document.getElementById("jobName").value,
            location: document.getElementById("jobLocation").value,
            wages: parseInt(document.getElementById("jobWages").value),
            date: document.getElementById("jobDate").value,
            timings: `${document.getElementById("jobTimeFrom").value} - ${document.getElementById("jobTimeTo").value}`,
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
                jobsContainer.appendChild(jobCard);
                jobForm.reset();
            } else {
                alert("Failed to post job");
            }
        } catch (err) {
            console.error("Error posting job:", err);
        }
    });

    // ✅ Initial fetch
    if (farmerId) fetchJobs();
    jobCard.querySelector(".complete-job").addEventListener("click", () => {
        jobCard.classList.add("completed");
        jobCard.querySelector(".complete-job").disabled = true;
        jobCard.querySelector(".complete-job").innerHTML = `<i class="fas fa-check-circle"></i> Done`;
    });
});
