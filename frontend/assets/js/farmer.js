document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const fullname = registerForm.fullname.value.trim();
        const email = registerForm.email.value.trim();
        const phone = registerForm.phone.value.trim();
        const password = registerForm.password.value.trim();
        const confirmPassword = registerForm.confirm_password.value.trim();
        const farmLocation = registerForm.farm_location.value.trim();
        const farmSize = parseInt(registerForm.farm_size.value.trim());
        const termsAccepted = registerForm.terms.checked;

        // Regular expressions for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone numbers

        // Validation checks
        if (!fullname || !email || !phone || !password || !farmLocation || !farmSize) {
            showError("All fields are required.");
            return;
        }

        if (!emailRegex.test(email)) {
            showError("Invalid email format.");
            return;
        }

        if (!phoneRegex.test(phone)) {
            showError("Phone number must be 10 digits.");
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

        if (!termsAccepted) {
            showError("You must agree to the Terms & Conditions.");
            return;
        }

        // Prepare data to send to backend
        const farmerData = {
            fullname: fullname,
            email: email,
            phone: phone,
            password: password,
            farm_location: farmLocation,
            farm_size: farmSize
        };

        try {
            const response = await fetch("http://localhost:8000/api/auth/farmers/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(farmerData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess("Registration successful! Redirecting to login...");
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = "loginfarmer.html";
                }, 2000);
            } else {
                showError(data.message || "Registration failed.");
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
    const loginForm = document.getElementById("login-form");

    // Validate the form before submission
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const emailInput = loginForm.email.value.trim();
        const passwordInput = loginForm.password.value.trim();

        // Regular expressions for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone numbers

        // Check if the email/phone is valid
        if (!emailRegex.test(emailInput) && !phoneRegex.test(emailInput)) {
            showError("Please enter a valid email or phone number.");
            return;
        }

        // Check if password is entered
        if (passwordInput.length < 6) {
            showError("Password must be at least 6 characters long.");
            return;
        }

        // Show loading message
        showSuccess("Logging in...");

        try {
            // Make API call to login endpoint
            const response = await fetch("http://localhost:8000/api/auth/farmers/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailInput,
                    password: passwordInput
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token in localStorage
                localStorage.setItem("token", data.token);
                
                // Redirect to dashboard or homepage
                showSuccess("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/farmerdashboard.html"; // Change to your dashboard URL
                }, 2000);
            } else {
                showError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            showError("Server error. Please try again later.");
            console.error("Login Error:", error);
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

    // Toggle password visibility
    const passwordField = document.querySelector("input[name='password']");
    const passwordIcon = document.createElement("i");
    passwordIcon.classList.add("fas", "fa-eye");
    passwordIcon.style.cursor = "pointer";
    passwordField.parentNode.appendChild(passwordIcon);

    passwordIcon.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            passwordIcon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            passwordField.type = "password";
            passwordIcon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });

    // Add floating label effect on input focus
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("focus", function () {
            this.parentElement.classList.add("focus");
        });
        input.addEventListener("blur", function () {
            if (this.value === "") {
                this.parentElement.classList.remove("focus");
            }
        });
    });
});
