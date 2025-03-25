document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("laborer-login-form");
    const identifierInput = form.querySelector("input[name='laborer_identifier']");
    const passwordInput = form.querySelector("input[name='laborer_password']");

    form.addEventListener("submit", function (event) {
        let isValid = true;
        let identifierValue = identifierInput.value.trim();
        let passwordValue = passwordInput.value.trim();

        // Regular expressions for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/; // Valid Indian mobile numbers (10 digits, starts with 6-9)

        // Validate Identifier (Mobile or Email)
        if (!emailRegex.test(identifierValue) && !mobileRegex.test(identifierValue)) {
            showError(identifierInput, "Enter a valid Email or Mobile Number!");
            isValid = false;
        } else {
            clearError(identifierInput);
        }

        // Validate Password
        if (passwordValue.length < 6) {
            showError(passwordInput, "Password must be at least 6 characters long!");
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        // Prevent form submission if validation fails
        if (!isValid) {
            event.preventDefault();
        }
    });

    // Function to display error message
    function showError(input, message) {
        clearError(input);
        const errorText = document.createElement("small");
        errorText.classList.add("error-text");
        errorText.style.color = "red";
        errorText.innerText = message;
        input.parentNode.appendChild(errorText);
    }

    // Function to clear error message
    function clearError(input) {
        const errorText = input.parentNode.querySelector(".error-text");
        if (errorText) {
            errorText.remove();
        }
    }
});
