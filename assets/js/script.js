const btn1 = document.getElementById("web-design");
const btn2 = document.getElementById("création-graphique");
const btn3 = document.getElementById("réalisations-personnelles");
const projets = document.querySelector(".img-section");
const buttons1 = document.querySelectorAll(".btnCarousel1");
const slides1 = document.querySelectorAll(".slide1");
const buttons2 = document.querySelectorAll(".btnCarousel2");
const slides2 = document.querySelectorAll(".slide2");

buttons1.forEach((button) => {
  button.addEventListener("click", (e) => {
    const calcNextSlide = e.target.id === "next1" ? 1 : -1;
    const slideActive = document.querySelector(".active1");

    newIndex = calcNextSlide + [...slides1].indexOf(slideActive);

    if (newIndex < 0) newIndex = [...slides1].length - 1;
    if (newIndex >= [...slides1].length) newIndex = 0;
    slides1[newIndex].classList.add("active1");
    slideActive.classList.remove("active1");
  });
});

buttons2.forEach((button) => {
  button.addEventListener("click", (e) => {
    const calcNextSlide = e.target.id === "next2" ? 1 : -1;
    const slideActive = document.querySelector(".active2");

    newIndex = calcNextSlide + [...slides2].indexOf(slideActive);

    if (newIndex < 0) newIndex = [...slides2].length - 1;
    if (newIndex >= [...slides2].length) newIndex = 0;
    slides2[newIndex].classList.add("active2");
    slideActive.classList.remove("active2");
  });
});
let intervalId = null;

function startAutoChange() {
  let index = 0;
  const images = [
    {
      url: "url('./assets/img/Accueil/web-design.webp')",
      btnActive: btn1,
      btnOthers: [btn2, btn3],
    },
    {
      url: "url('./assets/img/Accueil/crea-graphique.webp')",
      btnActive: btn2,
      btnOthers: [btn1, btn3],
    },
    {
      url: "url('./assets/img/Accueil/réal-perso.webp')",
      btnActive: btn3,
      btnOthers: [btn1, btn2],
    },
  ];

  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    const current = images[index];
    projets.style.backgroundImage = current.url;
    current.btnActive.style.color = "#3066ad";
    current.btnOthers.forEach((btn) => (btn.style.color = "#3066ad8f"));

    index = (index + 1) % images.length;
  }, 4000);
}

function stopAutoChange() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function setHoverEvents() {
  btn1.addEventListener("mouseover", () => {
    projets.style.backgroundImage =
      "url('./assets/img/Accueil/web-design.webp')";
    btn1.style.color = "#3066ad";
    btn2.style.color = "#3066ad8f";
    btn3.style.color = "#3066ad8f";
  });

  btn2.addEventListener("mouseover", () => {
    projets.style.backgroundImage =
      "url('./assets/img/Accueil/crea-graphique.webp')";
    btn1.style.color = "#3066ad8f";
    btn2.style.color = "#3066ad";
    btn3.style.color = "#3066ad8f";
  });

  btn3.addEventListener("mouseover", () => {
    projets.style.backgroundImage =
      "url('./assets/img/Accueil/réal-perso.webp')";
    btn1.style.color = "#3066ad8f";
    btn2.style.color = "#3066ad8f";
    btn3.style.color = "#3066ad";
  });
}

function stopHoverEvents() {
  btn1.removeEventListener("mouseover", setHoverEvents);
  btn2.removeEventListener("mouseover", setHoverEvents);
  btn3.removeEventListener("mouseover", setHoverEvents);
}

function handleResize() {
  if (window.innerWidth <= 640) {
    stopHoverEvents();
    startAutoChange();
  } else {
    stopAutoChange();
    setHoverEvents();
  }
}

handleResize();

window.addEventListener("resize", handleResize);
