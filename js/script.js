// ----------------------------Menu Burger---------------------------------------------
const menu = document.querySelectorAll("nav li");

icons.addEventListener("click", () => {
  nav.classList.toggle("active");
});

menu.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});