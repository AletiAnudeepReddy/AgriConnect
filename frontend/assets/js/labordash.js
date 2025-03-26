document.addEventListener("DOMContentLoaded", function () {
    const jobListingsContainer = document.querySelector(".job-listings");

    // Sample job data (can be modified dynamically)
    const jobData = [
        {
            id: 1,
            title: "Farm Helper Needed",
            location: "Green Valley Farms",
            date: "6th Oct, 2024",
            timings: "12 PM - 6 PM",
            wages: "₹600",
            workersRequired: 10
        },
        {
            id: 2,
            title: "Harvest Worker",
            location: "Sunrise Fields",
            date: "6th Oct, 2024",
            timings: "8 AM - 2 PM",
            wages: "₹600",
            workersRequired: 10
        },
        {
            id: 3,
            title: "Crop Plantation Assistant",
            location: "Blue Ridge Farm",
            date: "7th Oct, 2024",
            timings: "7 AM - 1 PM",
            wages: "₹700",
            workersRequired: 5
        },
        {
            id: 4,
            title: "Irrigation System Operator",
            location: "Golden Harvest Fields",
            date: "8th Oct, 2024",
            timings: "9 AM - 3 PM",
            wages: "₹750",
            workersRequired: 8
        }
    ];

    let jobsVisible = 1; // Number of jobs initially visible

    // Function to display jobs dynamically
    function displayJobs() {
        jobListingsContainer.innerHTML = "<h2>Available Jobs</h2>"; // Clear old job listings

        jobData.slice(0, jobsVisible).forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.classList.add("job-card");
            jobCard.setAttribute("data-job-id", job.id);

            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Location:</strong> <span class="job-location">${job.location}</span></p>
                <p><strong>Date:</strong> ${job.date}</p>
                <p><strong>Timings:</strong> ${job.timings}</p>
                <p><strong>Wages:</strong> ${job.wages}</p>
                <p><strong>Workers Required:</strong> ${job.workersRequired}</p>
                <button class="apply-btn" onclick="applyForJob(${job.id})"><i class="fas fa-paper-plane"></i> Apply</button>
            `;
            jobListingsContainer.appendChild(jobCard);
        });

        // Add "View More Jobs" button if there are hidden jobs
        if (jobsVisible < jobData.length) {
            const viewMoreBtn = document.createElement("button");
            viewMoreBtn.id = "view-more-btn";
            viewMoreBtn.classList.add("view-more-btn");
            viewMoreBtn.innerHTML = `<i class="fas fa-angle-down"></i> View More Jobs`;
            viewMoreBtn.addEventListener("click", loadMoreJobs);
            jobListingsContainer.appendChild(viewMoreBtn);
        }
    }

    // Function to apply for a job
    function applyForJob(jobId) {
        alert(`Applied for Job ID: ${jobId}`);
    }

    // Function to load more jobs when button is clicked
    function loadMoreJobs() {
        jobsVisible = jobData.length; // Show all jobs
        displayJobs(); // Re-render job listings
    }

    // Display initial jobs on page load
    displayJobs();
    const currentJobContainer = document.getElementById("current-job-content");
    
        // Mock data: Replace this with actual user data from backend
        const userCurrentJob = {
            jobTitle: "Harvest Worker",
            location: "Sunrise Fields",
            startTime: "8 AM",
            endTime: "2 PM",
            wages: "₹600",
            liveLocation: "Tracking..."
        };
    
        // If no job is accepted
        if (!userCurrentJob) {
            currentJobContainer.innerHTML = `<p class="no-job-text">You have no active jobs. <br> Apply for a job now!</p>`;
        } else {
            // Display the active job details
            currentJobContainer.innerHTML = `
                <div class="job-active">
        <!-- Live Location Button -->
        <button class="location-btn" onclick="openLiveLocation('${userCurrentJob.liveLocationUrl}')">
            <i class="fas fa-map-marker-alt"></i>
        </button>
    
        <div class="job-info">
            <h3>Currently Working Job</h3>
            <p><strong>Job:</strong> ${userCurrentJob.jobTitle}</p>
            <p><strong>Location:</strong> ${userCurrentJob.location}</p>
            <p><strong>Timings:</strong> ${userCurrentJob.startTime} - ${userCurrentJob.endTime}</p>
            <p><strong>Wages:</strong> ${userCurrentJob.wages}</p>
            <p><strong>Live Location:</strong> <span>${userCurrentJob.liveLocation}</span></p>
        </div>
    
        <!-- Call Farmer Button -->
        <button class="call-btn" onclick="callFarmer('${userCurrentJob.farmerPhone}')">
            <i class="fas fa-phone-alt"></i>
        </button>
    </div>
            `;
        }
    
});
