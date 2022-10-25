"use strict";

const background = document.querySelector(".main");
const wave = document.querySelector(".layer1");
const headingName = document.querySelector("#name1");
const headingLine = document.querySelector("#name2");
const buttons = document.querySelector(".buttons");
const options = document.querySelector(".options");
const opt1 = document.querySelector(".cont1");
const opt2 = document.querySelector(".cont2");
const nameFooter = document.querySelector(".nameFooter");
const outline1 = document.querySelector(".outline1");
const cont1 = document.querySelector(".cont1");
const box1 = document.querySelector(".box1");
const info1 = document.querySelector("#info1a");
const shadow = document.querySelector(".shadow");
const getStarted = document.querySelector("#log1");
const logIn = document.querySelector("#log2");
const arrowImg = document.querySelector("#arrow");
const footer = document.querySelector(".footer");

document.addEventListener("DOMContentLoaded", function (e) {
  //   boxBlack.style.transform = "translateX(-50vw)";
  wave.style.opacity = 100;
  headingName.style.opacity = 100;
  headingName.style.transform = "translateX(0)";
  headingLine.style.transform = "translateY(0)";
  buttons.style.transform = "translateY(0)";
  headingLine.style.opacity = 100;
  buttons.style.opacity = 100;
});

console.log(options.getBoundingClientRect());

const observer = new IntersectionObserver(
  function (entries) {
    // console.log(entries);
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    // window.scrollTo({
    //   left: options.getBoundingClientRect().left + window.pageXOffset,
    //   top: options.getBoundingClientRect().top + window.pageYOffset,
    //   behaviour: "smooth",
    // });
    // options.scrollIntoView(true, { behavior: "smooth" });
    opt1.style.opacity = 100;
    opt2.style.opacity = 100;
    opt1.style.transform = "translateY(0)";
    opt2.style.transform = "translateY(0)";
  },
  {
    root: null,
    threshold: 0.2,
  }
);

observer.observe(options);

// const observer2 = new IntersectionObserver(
//   function (entries) {
//     console.log(entries);
//     const [entry] = entries;
//     if (entry.isIntersecting) {
//       window.scrollTo({
//         left: options.getBoundingClientRectX() + window.pageXOffset,
//         top: options.getBoundingClientRectY() + window.pageYOffset,
//         behaviour: "smooth",
//       });
//     }
//   },
//   {
//     root: null,
//     threshold: 0.1,
//   }
// );

// observer2.observe(options);

nameFooter.addEventListener("click", function (e) {
  e.preventDefault();
  document
    .querySelector(e.target.getAttribute("href"))
    .scrollIntoView({ behavior: "smooth" });
});

const hoverAnimation = function (element) {
  element.style.backgroundColor = "black";
  element.style.color = "white";
};

const counterHoverAnimation = function (element) {
  element.style.backgroundColor = "transparent";
  element.style.color = "black";
};

getStarted.addEventListener("mouseenter", function () {
  hoverAnimation(this);
  arrowImg.src = "Images/Arrow.png";
});

getStarted.addEventListener("mouseleave", function () {
  counterHoverAnimation(this);
  arrowImg.src = "Images/Arrow2.png";
});

logIn.addEventListener("mouseenter", hoverAnimation.bind(logIn, logIn));
logIn.addEventListener("mouseleave", counterHoverAnimation.bind(logIn, logIn));

const iconHover = function (element) {
  element.addEventListener("mouseenter", function () {
    element.src = `Images/${element.dataset.name}-fill.svg`;
  });
  element.addEventListener("mouseleave", function () {
    element.src = `Images/${element.dataset.name}.svg`;
  });
};

iconHover(document.querySelector(".instagram"));
iconHover(document.querySelector(".facebook"));
iconHover(document.querySelector(".linkedin"));
