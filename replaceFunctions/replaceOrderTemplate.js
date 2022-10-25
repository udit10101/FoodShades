const { pool } = require('../dbConfig')
module.exports = (ordersarr, tempCard) => {
    
    let totprice=0;
    let output=tempCard.replace(/{%res-name%}/g,ordersarr[0].resname)
    output=output.replace(/{%order-date%}/g,ordersarr[0].date)
    ordersarr.forEach(element => {
        totprice+=element.dishtotal
    });
    output=output.replace(/{%totprice%}/g,totprice)
    let dishestext=ordersarr.map((el)=> `${el.dishname} X ${el.quantity}` ).join(', ');
    output=output.replace(/{%dishes%}/g,dishestext);
    return output;
}
