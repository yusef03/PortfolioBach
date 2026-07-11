"use strict";
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");
if (lightbox && lightboxImg && closeBtn) {
    document.querySelectorAll(".zoomable-img").forEach((img) => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });
    closeBtn.addEventListener("click", () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = "auto";
    });
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
}
