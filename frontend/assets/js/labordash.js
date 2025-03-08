document.addEventListener("DOMContentLoaded", () => {
    let currentJobIndex = 0;
    const jobsPerLoad = 2; // Load 2 jobs at a time

    const jobs = [
        {
            id: 1,
            title: "Farm Helper Needed",
            location: "Green Valley Farms",
            date: "6th Oct, 2024",
            startTime: "12 PM",
            endTime: "6 PM",
            wages: "₹600",
            workers: 10
        },
        {
            id: 2,
            title: "Harvest Worker",
            location: "Sunrise Fields",
            date: "6th Oct, 2024",
            startTime: "8 AM",
            endTime: "2 PM",
            wages: "₹600",
            workers: 10
        },
        {
            id: 3,
            title: "Irrigation Assistant",
            location: "Golden Harvest Farm",
            date: "7th Oct, 2024",
            startTime: "7 AM",
            endTime: "1 PM",
            wages: "₹550",
            workers: 8
        },
        {
            id: 4,
            title: "Pesticide Sprayer",
            location: "Green Acres",
            date: "8th Oct, 2024",
            startTime: "9 AM",
            endTime: "3 PM",
            wages: "₹620",
            workers: 12
        }
    ];

    function loadJobs() {
        const jobContainer = document.getElementById("job-container");
        let jobsToLoad = jobs.slice(currentJobIndex, currentJobIndex + jobsPerLoad);
        
        jobsToLoad.forEach(job => {
            let jobHTML = `
                <div class="job-card" data-job-id="${job.id}">
                    <h3>${job.title}</h3>
                    <p><strong>Location:</strong> <span class="job-location">${job.location}</span></p>
                    <p><strong>Date:</strong> ${job.date}</p>
                    <p><strong>Timings:</strong> ${job.startTime} - ${job.endTime}</p>
                    <p><strong>Wages:</strong> ${job.wages}</p>
                    <p><strong>Workers Required:</strong> ${job.workers}</p>
                    <button class="apply-btn"><i class="fas fa-paper-plane"></i> Apply</button>
                </div>
            `;
            jobContainer.innerHTML += jobHTML;
        });

        currentJobIndex += jobsPerLoad;
        if (currentJobIndex >= jobs.length) {
            document.getElementById("view-more-btn").style.display = "none";
        }
    }

    document.getElementById("view-more-btn").addEventListener("click", loadJobs);
    
    // Load initial jobs
    loadJobs();
});
