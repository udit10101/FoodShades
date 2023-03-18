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
const replacedishtemplate = require(`${__dirname}/../replaceFunctions/replacedishtemplate`);
const replaceTemplate = require(`${__dirname}/../replaceFunctions/replaceTemplate`);
const tempCard = fs.readFileSync(
  `${__dirname}/../templates/temp-res-card.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/../templates/template-overview.html`,
  'utf-8'
);

const tempForm = fs.readFileSync(
  `${__dirname}/../templates/temp-form.html`,
  'utf-8'
);
const dishform = fs.readFileSync(
  `${__dirname}/../templates/template-dish-form.html`,
  'utf-8'
);

exports.home = async (req, res) => {
  let resObjs = [];
  for (var i = 0; i < resNamesObj.length; i++) {
    const data = await pool.query(
      `Select * from additionalinfo where resname='${resNamesObj[i].resname}'`
    );

    resObjs.push(data.rows[0]);
  }
  const cardsHtml = resObjs.map((el) => replaceTemplate(el, tempCard)).join('');
  let output = tempOverview.replace('{%res-cards%}', cardsHtml);
  output = output.replace('{%nav-color-all%}', 'nav-color-all');
  res.send(output);
};

exports.restaurantSignup = async (req, res) => {
  let resObjs = [];
  const data = await pool.query(
    `Select * from additionalinfo where resname='${req.params.restname}'`
  );
  resObjs.push(data.rows[0]);

  const output = resObjs.map((el) => replaceTemplate(el, tempForm)).join('');
  const data2 = await pool.query(`Select * from "${req.params.restname}"`);
  const dishesHtml = data2.rows
    .map((el) => replacedishtemplate(el, dishform))
    .join('');
  const output2 = output.replace('{%dishes%}', dishesHtml);
  res.send(output2);
};
exports.sendIndex=(req, res) => {
  res.render('index2');
}