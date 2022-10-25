"use strict";

const background = document.querySelector(".main");
const boxBlack = document.querySelector(".black");
const headingName = document.querySelector("#name1");
const headingLine = document.querySelector("#name2");
const buttons = document.querySelector(".buttons");
const options = document.querySelector(".options");
const opt1 = document.querySelector(".cont1");
const opt2 = document.querySelector(".cont2");
const nameFooter = document.querySelector(".nameFooter");

document.addEventListener("DOMContentLoaded", function (e) {
  boxBlack.style.transform = "translateX(-50vw)";
  headingName.style.opacity = 100;
  headingLine.style.transform = "translateY(0)";
  buttons.style.transform = "translateY(0)";
  headingLine.style.opacity = 100;
  buttons.style.opacity = 100;
});

const observer = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    opt1.style.opacity = 100;
    opt2.style.opacity = 100;
    opt1.style.transform = "translateY(0)";
    opt2.style.transform = "translateY(0)";
  },
  {
    root: null,
    threshold: 0.1,
  }
);

observer.observe(options);

nameFooter.addEventListener("click", function (e) {
  e.preventDefault();
  document
    .querySelector(e.target.getAttribute("href"))
    .scrollIntoView({ behavior: "smooth" });
});