module.exports = (tableObj, tempCard) => {
  let output = tempCard.replace(/{%res-name%}/g, tableObj.resname)
  output = output.replace(/{%res-type%}/g, tableObj.typefood)
  output = output.replace(/{%res-rating%}/g, tableObj.totrating)
  output = output.replace(/{%res-deltime%}/g, tableObj.deliverytime)
  output = output.replace(/{%res-imglink%}/g, tableObj.resimglink)
  output = output.replace(/{%res-location%}/g, tableObj.location)

  if (tableObj.category === 'V') {
    output = output.replace(`rgb(226, 10, 10)`, `transparent`)
  }
 
  if (tableObj.category === 'N') {
    output = output.replace(`green`, `transparent`)
  }
  

  return output
}
