// const footer = document.querySelector(".footer");


const iconHoverFooter = function (element) {
  element.addEventListener("mouseenter", function () {
    element.src = `./../Images/${element.dataset.name}-fill.svg`;
  });
  element.addEventListener("mouseleave", function () {
    element.src = `./../Images/${element.dataset.name}.svg`;
  });
};

iconHoverFooter(document.querySelector(".instagram"));
iconHoverFooter(document.querySelector(".facebook"));
iconHoverFooter(document.querySelector(".linkedin"));
