const fs = require('fs');
const { pool } = require('./../dbConfig');

const resNamesObj = [];
async function getNames() {
  const rn = await pool.query(`Select * from resnames`);
  for (let i = 0; i < rn.rows.length; i++) {
    resNamesObj.push(rn.rows[i]);
  }
}
getNames();
const replaceTemplate = require(`${__dirname}/../replaceFunctions/replaceTemplate`);
const replacedishtemplate = require(`${__dirname}/../replaceFunctions/replacedishtemplate`);

const tempResPage = fs.readFileSync(
  `${__dirname}/../templates/restaurant.html`,
  'utf-8'
);
const tempDishCard = fs.readFileSync(
  `${__dirname}/../templates/temp-dish-card.html`,
  'utf-8'
);
const resAuth = fs.readFileSync(
  `${__dirname}/../templates/resauth.html`,
  'utf-8'
);

const orderPlacedDishes = fs.readFileSync(
  `${__dirname}/../templates/orderPlacedDishes.html`,
  'utf-8'
);
const orderPlaced = fs.readFileSync(
  `${__dirname}/../templates/orderPlaced.html`,
  'utf-8'
);
const orderPlacedBill = fs.readFileSync(
  `${__dirname}/../templates/orderPlacedBill.html`,
  'utf-8'
);

exports.getRestaurantSignup = async (req, res) => {
  res.send(resAuth);
};
exports.postRestaurant = async (req, res) => {
  let flag = 0;
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(
      `Select * from additionalinfo where resname='${resNamesObj[i].resname}'`
    );
    if (data.rows[0].resname == req.body.resnameinp) {
      if (data.rows[0].respassword == req.body.respassinp) {
        flag = 1;

        res.redirect(`/form=${req.body.resnameinp}`);
      } else {
        flag = 2;
        res.send('INCORRECT details');
      }
    }
  }
  if (flag === 0) {
    res.send('INCORRECT details');
  }
};
exports.cartItems=async (req, res) => {
    const data = JSON.parse(req.body);
    let dishnames = data.dishnames;
    let quantity = data.quantity;
    let dishtotal = data.dishtotal;
    let totalprice = data.totalprice;
    let resname = data.resname;
    let date = data.date;
  
    let transId;
    for (var i = 0; i < dishnames.length; i++) {
      if (i == 0) {
        transId = await pool.query(
          `INSERT INTO "Past Orders" (userid,dishname,quantity,dishtotal,resname,date) Values(${req.user.id},'${dishnames[i]}',${quantity[i]},${dishtotal[i]},'${resname}','${date}') RETURNING transId`
        );
      } else {
        await pool.query(
          `INSERT INTO "Past Orders" (transid,userid,dishname,quantity,dishtotal,resname,date) Values(${transId.rows[0].transid},${req.user.id},'${dishnames[i]}',${quantity[i]},${dishtotal[i]},'${resname}','${date}')`
        );
      }
    }
  }
exports.orderDetails=async (req, res) => {
    const dishesData = [];
    const quantity = [];
    const dishtotal = [];
    let subtotal = 0;
  
    const data = await pool.query(
      `SELECT * FROM "Past Orders" where userid=${req.user.id} and transid=(SELECT MAX(transid) from "Past Orders" where userid=${req.user.id})`
    );
  
    for (var i = 0; i < data.rows.length; i++) {
      quantity.push(data.rows[i].quantity);
      dishtotal.push(data.rows[i].dishtotal);
      const data1 = await pool.query(
        `SELECT * FROM "${data.rows[i].resname}" where dishname='${data.rows[i].dishname}'`
      );
      subtotal += data.rows[i].dishtotal;
      dishesData.push(data1.rows[0]);
    }
  
    let cardsHtml = dishesData
      .map((el) => replacedishtemplate(el, orderPlacedDishes))
      .join('');
  
    let cardsHtml2 = dishesData
      .map((el) => replacedishtemplate(el, orderPlacedBill))
      .join('');
    let output = orderPlaced.replace('{%dishesordered%}', cardsHtml);
    output = output.replace('{%billdetailscart%}', cardsHtml2);
  
    //For 2 templates Hence 2 times for loop
    for (let i = 0; i < quantity.length; i++) {
      output = output.replace('{%quantity%}', quantity[i]);
    }
    for (let i = 0; i < quantity.length; i++) {
      output = output.replace('{%quantity%}', quantity[i]);
    }
    for (let i = 0; i < quantity.length; i++) {
      output = output.replace('{%dish-total%}', dishtotal[i]);
    }
    output = output.replace('{%res-name%}', data.rows[0].resname);
    output = output.replace('{%subtotal%}', subtotal);
    output = output.replace('{%total%}', subtotal + 40);
  
    res.send(output);
  }
exports.ratingUpdate=async (req, res) => {
    let data = JSON.parse(req.body);
    let data1 = await pool.query(
      `SELECT numrating,totrating FROM additionalinfo WHERE resname='${data.resname}' `
    );
    let newnumrating = data1.rows[0].numrating + 1;
    let newtotrating =
      (data1.rows[0].numrating * data1.rows[0].totrating + data.ratings) /
      newnumrating;
    await pool.query(
      `UPDATE additionalinfo SET numrating=${newnumrating},totrating=${newtotrating} where resname='${data.resname}'`
    );
  }
  exports.updateRestaurant=async (req, res) => {
    let { olddishname, dishname, imglink, price, descr, category } = req.body;
  
    const flag = await pool.query(
      `select dishid from "${req.params.restname}" where dishname='${olddishname}'`
    );
    if (flag.rows[0]) {
      await pool.query(
        `UPDATE "${req.params.restname}" SET dishname='${dishname}',price=${price},dishimglink='${imglink}',category='${category}' where dishname='${olddishname}' `
      );
    } else {
      let dishid = await pool.query(
        `select dishid from "${req.params.restname}"`
      );
      const len = dishid.rows.length + 1;
      await pool.query(
        `insert into "${req.params.restname}" VALUES(${len},'${req.body.dishname}',${req.body.price},'${req.body.category}','${req.body.descr}','${req.body.imglink}') `
      );
    }
    res.redirect(`/form=${req.params.restname}`);
  }
  exports.restaurants = async (req, res) => {
    let resObjs = [];
    const data = await pool.query(
      `Select * from additionalinfo where resname='${req.query.rname}'`
    );
  
    resObjs.push(data.rows[0]);
  
    const output = resObjs.map((el) => replaceTemplate(el, tempResPage)).join('');
  
    const data2 = await pool.query(`Select * from "${req.query.rname}"`);
    const dishesHtml = data2.rows
      .map((el) => replacedishtemplate(el, tempDishCard))
      .join('');
  
    const output2 = output.replace('{%dishes%}', dishesHtml);
  
    // console.log(output2)
    res.send(output2);
  };