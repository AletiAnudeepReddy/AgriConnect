document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("laborer-register-form");
    const loginForm = document.getElementById("laborer-login-form");

    // Register Form Validation
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            const password = document.querySelector("input[name='laborer_password']").value;
            const confirmPassword = document.querySelector("input[name='laborer_confirm_password']").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                event.preventDefault();
            }
        });
    }

    // Login Form Validation
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            const mobileOrEmail = document.querySelector("input[name='laborer_identifier']").value;
            const password = document.querySelector("input[name='laborer_password']").value;

            if (!mobileOrEmail || !password) {
                alert("Please enter both Mobile Number/Email and Password.");
                event.preventDefault();
            }
        });
    }
});
