'use strict'

const homepagePastOrders = document.querySelector('.homePagePastOrders')
const homepageAccount = document.querySelector('.homepageAccount')
const homepageLogOut = document.querySelector('.homepageLogOut')


const slides = document.querySelectorAll('.banner')
const btnLeft = document.querySelector('.leftBanner')
const btnRight = document.querySelector('.rightBanner')
const dotContainer = document.querySelector('.dots')
const btnArrowLeft = document.querySelector('.btnArrowLeft')
const btnArrowRight = document.querySelector('.btnArrowRight')

// const slider = function () {
// }
if (slides.length!==0) {
  let curSlide = 0
  const maxSlide = slides.length

  const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`))
  }

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0
    } else {
      curSlide++
    }

    goToSlide(curSlide)
  }

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1
    } else {
      curSlide--
    }
    goToSlide(curSlide)
    activateDot(curSlide)
  }

  const init = function () {
    goToSlide(0)
    //   createDots();

    //   activateDot(0);
  }

  init()

  btnRight.addEventListener('click', nextSlide)
  btnLeft.addEventListener('click', prevSlide)

  const hoverAnimation = function (element) {
    element.style.backgroundColor = 'white'
  }

  const counterHoverAnimation = function (element) {
    element.style.backgroundColor = 'black'
  }

  btnLeft.addEventListener('mouseenter', function () {
    hoverAnimation(this)
    btnArrowLeft.src = './../Images/Arrow2.png'
  })

  btnLeft.addEventListener('mouseleave', function () {
    counterHoverAnimation(this)
    btnArrowLeft.src = './../Images/Arrow.png'
  })
  btnRight.addEventListener('mouseenter', function () {
    hoverAnimation(this)
    btnArrowRight.src = './../Images/Arrow2.png'
  })

  btnRight.addEventListener('mouseleave', function () {
    counterHoverAnimation(this)
    btnArrowRight.src = './../Images/Arrow.png'
  })
}
const iconHover = function (element, img) {
  element.addEventListener('mouseenter', function () {
    img.src = `./../Images/${img.dataset.name}-fill.svg`
  })
  element.addEventListener('mouseleave', function () {
    img.src = `./../Images/${img.dataset.name}.svg`
  })
}

const homepageAccountImg = document.querySelector('.homepageAccountImg')
const homepageLogOutImg = document.querySelector('.homepageLogOutImg')
const homepagePastOrdersImg = document.querySelector('.homePagePastOrdersImg')

iconHover(homepageAccount, homepageAccountImg)
iconHover(homepageLogOut, homepageLogOutImg)
iconHover(homepagePastOrders, homepagePastOrdersImg)
