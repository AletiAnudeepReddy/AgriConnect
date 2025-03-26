document.addEventListener("DOMContentLoaded", function() {
    const jobForm = document.getElementById("jobForm");
    const jobsContainer = document.getElementById("jobsContainer");

    // Function to add a job post
    function addJob(jobData) {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job");
        jobCard.innerHTML = `
            <h3>${jobData.jobName}</h3>
            <p>📍 Location: ${jobData.jobLocation}</p>
            <p>💰 Wages: ₹${jobData.jobWages} per day</p>
            <p>📅 Date: ${jobData.jobDate} | 🕒 ${jobData.jobTimeFrom} to ${jobData.jobTimeTo}</p>
            <p>👥 Workers Needed: ${jobData.numWorkers}</p>
            <button class="edit-job">Edit</button>
            <button class="delete-job">Delete</button>
        `;

        // Delete Job
        jobCard.querySelector(".delete-job").addEventListener("click", function() {
            jobCard.remove();
        });

        jobsContainer.appendChild(jobCard);
    }

    // Handle Job Form Submission
    jobForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Get input values
        const jobData = {
            jobName: document.getElementById("jobName").value,
            jobLocation: document.getElementById("jobLocation").value,
            jobWages: document.getElementById("jobWages").value,
            jobDate: document.getElementById("jobDate").value,
            jobTimeFrom: document.getElementById("jobTimeFrom").value,
            jobTimeTo: document.getElementById("jobTimeTo").value,
            numWorkers: document.getElementById("numWorkers").value,
        };

        // Add job to the list
        addJob(jobData);

        // Clear form
        jobForm.reset();
    });
});
