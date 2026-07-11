const lightbox = document.getElementById("lightbox") as HTMLElement | null;
const lightboxImg = document.getElementById("lightbox-img") as HTMLImageElement | null;
const closeBtn = document.querySelector(".lightbox-close") as HTMLElement | null;

if (lightbox && lightboxImg && closeBtn) {
  document.querySelectorAll<HTMLImageElement>(".zoomable-img").forEach((img) => {
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
