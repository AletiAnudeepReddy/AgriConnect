document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("laborer-register-form");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect input values
        const fullname = registerForm.laborer_fullname.value.trim();
        const phone = registerForm.laborer_phone.value.trim();
        const password = registerForm.laborer_password.value.trim();
        const confirmPassword = registerForm.laborer_confirm_password.value.trim();
        const skills = registerForm.laborer_skills.value;
        const experience = registerForm.laborer_experience.value.trim() || 0;
        const location = registerForm.laborer_location.value.trim();
        const termsAccepted = registerForm.laborer_terms.checked;

        // Regular expressions for validation
        const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone numbers

        // Validation checks
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

        // Show loading message
        showSuccess("Registering laborer...");

        try {
            // Make API call to register endpoint
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
                // Save token in localStorage
                localStorage.setItem("token", data.token);

                // Redirect to dashboard or homepage
                showSuccess("Registration successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/labordashboard.html"; // Change to your dashboard URL
                }, 2000);
            } else {
                showError(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            showError("Server error. Please try again later.");
            console.error("Registration Error:", error);
        }
    });

    // Function to show error messages
    function showError(message) {
        const errorBox = document.createElement("div");
        errorBox.className = "error-box";
        errorBox.textContent = message;
        document.body.appendChild(errorBox);

        setTimeout(() => {
            errorBox.remove();
        }, 3000);
    }

    // Function to show success messages
    function showSuccess(message) {
        const successBox = document.createElement("div");
        successBox.className = "success-box";
        successBox.textContent = message;
        document.body.appendChild(successBox);

        setTimeout(() => {
            successBox.remove();
        }, 2000);
    }
    const loginForm = document.getElementById("laborer-login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const identifier = loginForm.laborer_identifier.value.trim();
        const password = loginForm.laborer_password.value.trim();

        // Validation: Check if fields are not empty
        if (!identifier || !password) {
            showError("Please enter both Mobile/Email and Password.");
            return;
        }

        // Prepare data to send to backend
        const loginData = {
            identifier: identifier,  // Can be email or phone
            password: password
        };

        try {
            const response = await fetch("http://localhost:8000/api/auth/laborers/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess("Login successful! Redirecting...");
                
                // Store JWT token in localStorage
                localStorage.setItem("laborerToken", data.token);

                // Redirect to laborer dashboard
                setTimeout(() => {
                    window.location.href = "labordashboard.html";
                }, 1500);
            } else {
                showError(data.message || "Invalid credentials.");
            }
        } catch (error) {
            showError("Network error. Please try again.");
        }
    });

    // Function to show error messages
    function showError(message) {
        const errorBox = document.createElement("div");
        errorBox.className = "error-box";
        errorBox.textContent = message;
        document.body.appendChild(errorBox);

        setTimeout(() => {
            errorBox.remove();
        }, 3000);
    }

    // Function to show success messages
    function showSuccess(message) {
        const successBox = document.createElement("div");
        successBox.className = "success-box";
        successBox.textContent = message;
        document.body.appendChild(successBox);

        setTimeout(() => {
            successBox.remove();
        }, 2000);
    }

});
