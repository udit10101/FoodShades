"use strict";

const img1 = document.querySelector("#signUpimage1");
const img2 = document.querySelector("#signUpimage2");

setInterval(function () {
  if (Number(getComputedStyle(img1).opacity)) {
    img1.style.opacity = 0;
    img2.style.opacity = 100;
    return;
  }

  if (Number(getComputedStyle(img2).opacity)) {
    img2.style.opacity = 0;
    img1.style.opacity = 100;
    // console.log(getComputedStyle(img2).opacity);
    // return;
  }
}, 5000);
