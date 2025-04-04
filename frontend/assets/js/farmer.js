document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    // ---------- Message utilities ---------- //
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

    // ---------- Register form ---------- //
    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const fullname = registerForm.fullname.value.trim();
            const email = registerForm.email.value.trim();
            const phone = registerForm.phone.value.trim();
            const password = registerForm.password.value.trim();
            const confirmPassword = registerForm.confirm_password.value.trim();
            const farmLocation = registerForm.farm_location.value.trim();
            const farmSize = parseInt(registerForm.farm_size.value.trim());
            const termsAccepted = registerForm.terms.checked;

            if (!fullname || !email || !phone || !password || !farmLocation || !farmSize) {
                return showError("All fields are required.");
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showError("Invalid email.");
            }
            if (!/^[0-9]{10}$/.test(phone)) {
                return showError("Phone number must be 10 digits.");
            }
            if (password.length < 6) {
                return showError("Password too short.");
            }
            if (password !== confirmPassword) {
                return showError("Passwords don't match.");
            }
            if (!termsAccepted) {
                return showError("Accept the terms to proceed.");
            }

            const farmerData = {
                fullname,
                email,
                phone,
                password,
                farm_location: farmLocation,
                farm_size: farmSize
            };

            try {
                const res = await fetch("http://localhost:8000/api/auth/farmers/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(farmerData)
                });

                const data = await res.json();

                if (res.ok) {
                    showSuccess("Registered successfully!");
                    setTimeout(() => window.location.href = "loginfarmer.html", 2000);
                } else {
                    showError(data.message || "Registration failed.");
                }
            } catch (err) {
                showError("Server error. Try again.");
            }
        });
    }

    // ---------- Login form ---------- //
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = loginForm.email.value.trim();
            const password = loginForm.password.value.trim();

            if (!email || !password) {
                return showError("Enter email and password.");
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^[0-9]{10}$/.test(email)) {
                return showError("Invalid email or phone.");
            }
            if (password.length < 6) {
                return showError("Password too short.");
            }

            try {
                const res = await fetch("http://localhost:8000/api/auth/farmers/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    showSuccess("Login successful!");
                    localStorage.setItem("farmerName", data.fullname); 
                    setTimeout(() => window.location.href = "/frontend/farmerdashboard.html", 2000);
                } else {
                    showError(data.message || "Invalid credentials.");
                }
            } catch (err) {
                showError("Server error. Try again.");
            }
        });
    }

    // ---------- Password eye toggle ---------- //
    const passwordField = document.querySelector("input[name='password']");
    if (passwordField) {
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-eye");
        icon.style.cursor = "pointer";
        passwordField.parentNode.appendChild(icon);

        icon.addEventListener("click", () => {
            if (passwordField.type === "password") {
                passwordField.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                passwordField.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    }

    // ---------- Floating labels ---------- //
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("focus", () => input.parentElement.classList.add("focus"));
        input.addEventListener("blur", () => {
            if (input.value === "") input.parentElement.classList.remove("focus");
        });
    });
});
