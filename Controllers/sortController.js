const { pool } = require('./../dbConfig');
const resNamesObj = [];

async function getNames() {
  const rn = await pool.query(`Select * from resnames`);
  for (let i = 0; i < rn.rows.length; i++) {
    resNamesObj.push(rn.rows[i]);
  }
}
getNames();

const fs = require('fs');

const replaceTemplate = require(`${__dirname}/../replaceFunctions/replaceTemplate`);
const tempCard = fs.readFileSync(
  `${__dirname}/../templates/temp-res-card.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/../templates/template-overview.html`,
  'utf-8'
);

exports.vegOnly = async (req, res) => {
  let resObjs = [];

  const data = await pool.query(
    `Select * from additionalinfo where category='V'`
  );
  for (let i = 0; i < data.rows.length; i++) {
    resObjs.push(data.rows[i]);
  }
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('');
  let output = tempOverview.replace('{%res-cards%}', cardsHtml);
  output = output.replace('{%nav-color-vegonly%}', 'nav-color-vegonly');
  res.send(output);
};
exports.ratings = async (req, res) => {
  let resObjs = [];
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(
      `Select * from additionalinfo where resname='${resNamesObj[i].resname}'`
    );

    resObjs.push(data.rows[0]);
  }
  resObjs.sort((a, b) => b.totrating - a.totrating);
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('');
  let output = tempOverview.replace('{%res-cards%}', cardsHtml);
  output = output.replace('{%nav-color-rating%}', 'nav-color-rating');
  res.send(output);
};
exports.deliveryTime = async (req, res) => {
  let resObjs = [];
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(
      `Select * from additionalinfo where resname='${resNamesObj[i].resname}'`
    );

    resObjs.push(data.rows[0]);
  }
  resObjs.sort((a, b) => a.deliverytime - b.deliverytime);
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('');
  let output = tempOverview.replace('{%res-cards%}', cardsHtml);
  output = output.replace(
    '{%nav-color-deliverytime%}',
    'nav-color-deliverytime'
  );

  res.send(output);
};
exports.category = async (req, res) => {
  let resObjs = [];

  const data = await pool.query(
    `Select * from additionalinfo where typefood='${req.params.dish}'`
  );
  for (let i = 0; i < data.rows.length; i++) {
    resObjs.push(data.rows[i]);
  }
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('');
  let output = tempOverview.replace('{%res-cards%}', cardsHtml);
  output = output.replace('{%nav-color-c%}', 'nav-color-c');

  res.send(output);
};
