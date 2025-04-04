const applicants = [
    {
      name: "Ramesh Kumar",
      experience: "2 years",
      location: "Hyderabad",
      rating: "4.5",
    },
    {
      name: "Suresh Naidu",
      experience: "1.5 years",
      location: "Vijayawada",
      rating: "4.2",
    },
    {
      name: "Lakshmi Devi",
      experience: "3 years",
      location: "Guntur",
      rating: "4.8",
    },
    {
      name: "Rahul Varma",
      experience: "2.5 years",
      location: "Warangal",
      rating: "4.3",
    },
  ];
  
  const container = document.getElementById("applicants-list");
  
  applicants.forEach((applicant, index) => {
    const card = document.createElement("div");
    card.className = "applicant-card";
  
    card.innerHTML = `
      <div class="details">
        <h2><i class="fas fa-user"></i> ${applicant.name}</h2>
        <p><i class="fas fa-briefcase"></i> Experience: ${applicant.experience}</p>
        <p><i class="fas fa-map-marker-alt"></i> Location: ${applicant.location}</p>
        <p><i class="fas fa-star"></i> Rating: ${applicant.rating} / 5</p>
        <div class="action-buttons">
          <button class="accept-btn"><i class="fas fa-check-circle"></i> Accept</button>
          <button class="reject-btn"><i class="fas fa-times-circle"></i> Reject</button>
        </div>
      </div>
      <div class="sentiment-block">
        <button class="analyze-btn"><i class="fas fa-brain"></i> Analyze Sentiment</button>
        <div class="sentiment-result">Awaiting Analysis...</div>
      </div>
    `;
  
    container.appendChild(card);
  });
  
  // Sentiment Analysis Logic
  document.addEventListener('click', function (e) {
    if (e.target.closest('.analyze-btn')) {
      const btn = e.target.closest('.analyze-btn');
      const resultBox = btn.nextElementSibling;
      resultBox.textContent = "Analyzing...";
      resultBox.style.color = "#999";
  
      setTimeout(() => {
        const sentiments = ["Good 😊", "Average 😐", "Bad 😞"];
        const colors = ["green", "#e67e22", "red"];
        const random = Math.floor(Math.random() * sentiments.length);
        resultBox.textContent = `Sentiment: ${sentiments[random]}`;
        resultBox.style.color = colors[random];
      }, 2000);
    }
  });
  