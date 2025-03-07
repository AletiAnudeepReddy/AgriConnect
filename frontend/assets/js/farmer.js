document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-box");
    const registerForm = document.querySelector(".register-box");
    
    document.querySelector(".register-link").addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
    });

    document.querySelector(".login-link").addEventListener("click", function (e) {
        e.preventDefault();
        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });
});
