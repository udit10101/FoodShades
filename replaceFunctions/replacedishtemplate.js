module.exports = (tableObj, tempCard) => {
  // console.log(tableObj)
  let output = tempCard.replace(/{%dish-name%}/g, tableObj.dishname)
  output = output.replace(/{%dish-imglink%}/g, tableObj.dishimglink)
  output = output.replace(/{%dish-category%}/g, tableObj.category)
  output = output.replace(/{%dish-desc%}/g, tableObj.desc)
  output = output.replace(/{%dish-price%}/g, tableObj.price)

  if (tableObj.category === 'V') {
    output = output.replace(`class="veg" style="display: none;"`, `class="veg" `)
  } else {
    output = output.replace(`class="nonveg" style="display: none;"`, `class="nonveg"`)
  }

  return output
}
