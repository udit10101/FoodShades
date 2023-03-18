"use strict";

const ratingStars = document.querySelectorAll(".ratingBtn");
const ratingImgStars = document.querySelectorAll(".ratingImgStar");
let rating;
let k = 1;
let j;

ratingStars.forEach((ele, i) => {
  ele.addEventListener("mouseenter", function () {
   
    for (j = k; j <= Number(ele.dataset.postn); j++) {
      document.querySelector(`.ratingBtn${j}`).src = "./../Images/star-fill.svg";
    }
  });
});

ratingStars.forEach((ele, i) => {
  ele.addEventListener("mouseleave", function () {
    for (j = k; j <= Number(ele.dataset.postn); j++) {
      document.querySelector(`.ratingBtn${j}`).src = "./../Images/star.svg";
    }
  });
});

ratingStars.forEach((ele, i) => {
  ele.addEventListener("click", function () {
    rating = Number(ele.dataset.postn);
    for (k = 1; k <= Number(ele.dataset.postn); k++) {
      document.querySelector(`.ratingBtn${k}`).src = "./../Images/star-fill.svg";
    }
    removeFill(k);
    rating = k - 1;
    
    let ratingObj={ratings:0,resname:" "};
    ratingObj.resname= document.getElementById('resname').value;

    ratingObj.ratings=rating;
    navigator.sendBeacon('/restaurant/ratingUpdate', JSON.stringify(ratingObj));
  });
});

const removeFill = function (l) {
  for (; l <= 5; l++) {
    document.querySelector(`.ratingBtn${l}`).src = "./../Images/star.svg";
  }
};
