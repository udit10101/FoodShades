"use strict";

const body = document.querySelector("body");
const bodyHeight = getComputedStyle(body).height;
const overlay = document.querySelector(".overlay");
const btnOpenModal = document.querySelector(".addDish");
const btnOpenModalEdit = document.querySelectorAll(".editDish");
const btnCloseModal = document.querySelector(".modalClosebtn");
const modal = document.querySelector(".modalWindowEditRest");
overlay.style.height = bodyHeight;
console.log(btnOpenModalEdit);

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.addEventListener("click", openModal);
btnOpenModalEdit.forEach((ele) => ele.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

btnCloseModal.addEventListener("click", (e)=>{
  e.preventDefault();
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
btnOpenModalEdit.forEach((ele)=>ele.addEventListener('click',()=>{
  let dish=ele.parentElement.parentElement;
  let dishname=dish.getElementsByClassName('dishDisplayNameRest')[0].innerText;
  let dishprice=dish.getElementsByClassName('dishDisplayPriceRest')[0].innerText
  let dishdesc=dish.getElementsByClassName('dishDescriptionRest')[0].innerText
  let dishimagelink=dish.getElementsByClassName('dishDescriptionImg')[0].src;
  modal.querySelector("#olddishname").value=dishname;
  modal.querySelector("#dishname").value=dishname;
  modal.querySelector("#price").value=dishprice;
  modal.querySelector("#imglink").value=dishimagelink;
  modal.querySelector("#descr").value=dishdesc;
  

}))