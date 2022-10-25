if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
  } else {
    ready()
  }
 

  function ready() {
    let removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeCartItemButtons.length; i++) {
      let button = removeCartItemButtons[i]
      button.addEventListener('click', removeCartItem)
    }

    let quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (let i = 0; i < quantityInputs.length; i++) {
      let input = quantityInputs[i]
      input.addEventListener('change', quantityChanged)
    }

    let addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (let i = 0; i < addToCartButtons.length; i++) {
      let button = addToCartButtons[i]
      button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

  }


  function purchaseClicked() {
    alert('Thank you for your purchase')
    let cartDishes = { dishnames: [], quantity: [], dishtotal: [], totalprice: 0, resname: "{%res-name%}",date:" " };
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let dishNamesarr = document.getElementsByClassName('cart-item-title');
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
      let cartRow = cartRows[i]
      let priceElement = cartRow.getElementsByClassName('cart-price')[0]
      let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
      let price = parseFloat(priceElement.innerText.replace('₹', ''))
      let quantity = quantityElement.value
      total = total + (price * quantity);
      cartDishes.dishnames.push(dishNamesarr[i].innerText);
      cartDishes.quantity.push(quantity);
      cartDishes.dishtotal.push(quantity * price);
      cartDishes.totalprice = total;
      cartDishes.date = (new Date()).toLocaleString();
    



    }
    document.getElementsByClassName('orderDetails')[0].style.display="block"
    navigator.sendBeacon('/cartItems', JSON.stringify(cartDishes));

    let cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
    console.log("dome");
  }

  function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
  }

  function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1
    }
    updateCartTotal()
  }

  function addToCartClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    let price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    let imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    console.log(imageSrc);
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
  }

  function addItemToCart(title, price, imageSrc) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let i = 0; i < cartItemNames.length; i++) {
      if (cartItemNames[i].innerText == title) {
        alert('This item is already added to the cart')
        return
      }
    }
    let cartRowContents = `
      <div class="cart-item cart-column">
          <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
          <span class="cart-item-title">${title}</span>
      </div>
      <span class="cart-price cart-column">${price}</span>
      <div class="cart-quantity cart-column">
          <input class="cart-quantity-input" type="number" value="1">
          <button class="btn btn-danger" type="button">REMOVE</button>
      </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
  }

  function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
      let cartRow = cartRows[i]
      let priceElement = cartRow.getElementsByClassName('cart-price')[0]
      let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
      let price = parseFloat(priceElement.innerText.replace('₹', ''))
      let quantity = quantityElement.value
      total = total + (price * quantity)
    }
    document.getElementsByClassName('cart-total-price')[0].innerText = ' ₹' + total
    console.log(total);
  }

  function searchFnc() {
          // Declare variables
          let input, filter, ul, li, a, i, txtValue;
          input = document.getElementById('searchbar');
          filter = input.value.toUpperCase();
          console.log(filter);
          restCont=document.getElementsByClassName('dishes-container')[0]
          res=document.getElementsByClassName('dishDisplay')
          resnames=restCont.getElementsByClassName('dishDisplayName')

          // Loop through all list items, and hide those who don't match the search query
          for (i = 0; i < res.length; i++) {
              let match = res[i].getElementsByClassName('dishDisplayName')[0]
              let txtValue = match.textContent || match.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  res[i].style.display=" "
              } else {
                  res[i].style.display="none "
              }
              if(!filter){
                  console.log("empty rea");
                  for (i = 0; i < res.length; i++) {
                      res[i].style.display="flex"
                  }

              }
          }
      }
      
