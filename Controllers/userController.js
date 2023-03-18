const { pool } = require('./../dbConfig');
const bcrypt = require('bcrypt');
const fs = require('fs');
const replaceOrderTemplate = require(`${__dirname}/../replaceFunctions/replaceOrderTemplate`);
const pastOrderTemplate = fs.readFileSync(
  `${__dirname}/../templates/temp-past-order.html`,
  'utf-8'
);
const pastOrderOverviewTemplate = fs.readFileSync(
  `${__dirname}/../templates/temp-pastorders-overview.html`,
  'utf-8'
);
exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/user/login');
  });
};
exports.postUser = async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ message: 'Password must be a least 6 characters long' });
  }

  if (password !== password2) {
    errors.push({ message: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);

    // Validation passed
    pool.query(
      `SELECT * FROM user
          WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          // console.log(err);
        }

        if (results.rows.length > 0) {
          return res.render('register', {
            message: 'Email already registered',
          });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                  VALUES ($1, $2, $3)
                  RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }

              req.flash('success_msg', 'You are now registered. Please log in');
              res.redirect('/user/login');
            }
          );
        }
      }
    );
  }
};
exports.register = (req, res) => {
  res.render('register.ejs');
};
exports.login = (req, res) => {
  res.render('login.ejs');
};
exports.account = async (req, res) => {
  const user = req.user;
  res.render('account', { user });
};
exports.updateInfo = async (req, res) => {
  let { accountName, email, accountAddress } = req.body;

  pool.query(
    `UPDATE users SET name='${accountName}',address='${accountAddress}' WHERE id = ${req.user.id}  `,
    (err, results) => {
      if (err) {
        throw err;
      }

      req.flash('success_msg', 'INFO UPDATED SUCCESSFULLY');
      res.redirect('/user/account');
    }
  );
};
exports.updatePassword = async (req, res) => {
  let errors = [];
  let { accountOldPassword, accountNewPassword, accountConfirmNewPassword } =
    req.body;
  if (
    !accountOldPassword ||
    !accountNewPassword ||
    !accountConfirmNewPassword
  ) {
    req.flash('err_msg_password', 'Please enter all fields');
    res.redirect('/user/account');
  } else if (accountNewPassword.length < 6) {
    req.flash(
      'err_msg_password',
      'Password must be at least 6 characters long'
    );
    res.redirect('/user/account');
  } else {
    const userpassword = req.user.password;
    const hashedPassword = await bcrypt.hash(accountNewPassword, 10);
    bcrypt.compare(accountOldPassword, userpassword, (err, isMatch) => {
      if (err) {
        // console.log(err);
      } else {
        if (isMatch) {
          if (accountNewPassword === accountConfirmNewPassword) {
            pool.query(
              `UPDATE users SET password='${hashedPassword}' WHERE id = ${req.user.id}  `,
              (err, results) => {
                if (err) {
                  throw err;
                }

                req.flash(
                  'success_msg_password',
                  'PASSWORD UPDATED SUCCESSFULLY'
                );
                res.redirect('/user/account');
              }
            );
          } else {
            req.flash(
              'err_msg_password',
              'New password and Confirm Password does not match'
            );
            res.redirect('/user/account');
          }
        } else {
          req.flash('err_msg_password', 'Old Password is incorrect');

          res.redirect('/user/account');
        }
      }
    });
  }
};
exports.pastOrders = async (req, res) => {
  const userId = req.user.id;
  const maxTransIdArrayObj = await pool.query(
    `SELECT max(transid)  FROM "Past Orders" where userid=${userId}`
  );
  const minTransIdArrayObj = await pool.query(
    `SELECT min(transid)  FROM "Past Orders" where userid=${userId}`
  );

  let ordersHtml = '';
  const maxTransId = maxTransIdArrayObj.rows[0].max - 0;
  const minTransId = minTransIdArrayObj.rows[0].min - 0;
  // console.log(maxTransId);
  // console.log(minTransId);
  for (let i = maxTransId; i >= minTransId; i--) {
    let orders = await pool.query(
      `SELECT * FROM "Past Orders" where transid=${i} AND userid=${userId}`
    );
    if (orders.rows.length > 0) {
      ordersHtml += replaceOrderTemplate(orders.rows, pastOrderTemplate);
      let data = await pool.query(
        `SELECT resimglink,location from additionalinfo where resname='${orders.rows[0].resname}'`
      );
      ordersHtml = ordersHtml.replace(/{%res-img%}/g, data.rows[0].resimglink);
      ordersHtml = ordersHtml.replace(/{%location%}/g, data.rows[0].location);
    }
  }
  let output = pastOrderOverviewTemplate.replace('{%pastorders%}', ordersHtml);
  // console.log(output);
  res.send(output);
};
