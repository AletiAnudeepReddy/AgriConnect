document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    // Validate the form before submission
    loginForm.addEventListener("submit", function (event) {
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

        // If all validations pass, submit the form
        showSuccess("Logging in...");
        setTimeout(() => {
            loginForm.submit(); // Submit after delay for user experience
        }, 1000);
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