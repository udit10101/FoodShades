// const footer = document.querySelector(".footer");


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
