document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("laborer-register-form");
    function showError(message) {
        const box = document.createElement("div");
        box.className = "error-box";
        box.textContent = message;
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 3000);
    }

    function showSuccess(message) {
        const box = document.createElement("div");
        box.className = "success-box";
        box.textContent = message;
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 2000);
    }
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const fullname = registerForm.laborer_fullname.value.trim();
            const phone = registerForm.laborer_phone.value.trim();
            const password = registerForm.laborer_password.value.trim();
            const confirmPassword = registerForm.laborer_confirm_password.value.trim();
            const skills = registerForm.laborer_skills.value;
            const experience = registerForm.laborer_experience.value.trim() || 0;
            const location = registerForm.laborer_location.value.trim();
            const termsAccepted = registerForm.laborer_terms.checked;

            const phoneRegex = /^[0-9]{10}$/;

            if (fullname.length < 3) {
                showError("Full name must be at least 3 characters.");
                return;
            }
            if (!phoneRegex.test(phone)) {
                showError("Please enter a valid 10-digit phone number.");
                return;
            }
            if (password.length < 6) {
                showError("Password must be at least 6 characters long.");
                return;
            }
            if (password !== confirmPassword) {
                showError("Passwords do not match.");
                return;
            }
            if (!skills) {
                showError("Please select a work type.");
                return;
            }
            if (!termsAccepted) {
                showError("You must agree to the terms & conditions.");
                return;
            }

            showSuccess("Registering laborer...");

            try {
                const response = await fetch("http://localhost:8000/api/auth/laborers/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullname,
                        phone,
                        password,
                        skills,
                        experience: Number(experience),
                        location
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showSuccess("Registration successful! Redirecting...");
                    setTimeout(() => {
                        window.location.href = "./loginlabor.html";
                    }, 2000);
                } else {
                    showError(data.message || "Registration failed. Please try again.");
                }
            } catch (error) {
                showError("Server error. Please try again later.");
                console.error("Registration Error:", error);
            }
        });
    }

    const loginForm = document.getElementById("laborer-login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const phone = loginForm.laborer_identifier.value.trim();
            const password = loginForm.laborer_password.value.trim();

            if (!phone || !password) {
                showError("Please enter both Mobile and Password.");
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/api/auth/laborers/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ phone, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("laborerName", data.fullname);
                    localStorage.setItem("laborerWorkType", data.skills);
                    localStorage.setItem("laborerExperience", data.experience);
                    localStorage.setItem("laborerLocation", data.location);
                    localStorage.setItem("laborerId", data._id); 
                    showSuccess("Login successful! Redirecting...");
                    setTimeout(() => {
                        window.location.href = "./labordashboard.html";
                    }, 1500);
                } else {
                    showError(data.message || "Invalid credentials.");
                }
            } catch (error) {
                showError("Network error. Please try again.");
            }
        });
    }

    
});
