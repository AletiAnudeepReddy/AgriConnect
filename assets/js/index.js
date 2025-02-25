document.addEventListener("DOMContentLoaded", function () {
    let boxes = document.querySelectorAll(".box");

    boxes.forEach((box, index) => {
        setTimeout(() => {
            box.classList.add("show");
        }, index * 300); 
    });
});