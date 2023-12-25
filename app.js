/*
 * Names: Caroline Dong, Richard Zhang
 * Date: November 5, 2023
 * Section: CSE 154 AD/AE, Marina Wooden
 * Section: AG, Allison Ho/Kevin Wu
 *
 * This is the app.js page for our Final Project. It implements various endpoints, which add or take
 * information from the cars database that includes information for cars, users, and transactions.
 */

'use strict';
const express = require('express');
const app = express();
const multer = require('multer');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const PORT_NUM = 8000;
const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const MAX = 1000000000000000;
const SERVER_ERROR_MSG = 'Server seems to be down, please contact us at cdong@uw.edu.';

// Login Verification
app.post("/login", async (req, res) => {
  try {
    if (req.body.username && req.body.password) {
      let db = await getDBConnection();
      let username = req.body.username;
      let password = req.body.password;
      let query = "SELECT username, id FROM users WHERE username = ? AND password = ?";
      let result = await db.get(query, [username, password]);
      await db.close();
      if (result === undefined) {
        res.type('text').send("Failure");
      } else {
        let userId = result["id"];
        res.type('text').send(userId.toString());
      }
    } else {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send("Missing username/password");
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Register New Account
app.post("/register", async (req, res) => {
  try {
    if (req.body.newusername && req.body.newpassword && req.body.email) {
      let db = await getDBConnection();
      let username = req.body.newusername;
      let password = req.body.newpassword;
      let email = req.body.email;
      let query = "SELECT * FROM users WHERE username = ?";
      let result = await db.get(query, username);
      if (result === undefined) {
        query = "INSERT INTO users ('username', 'password', 'email') VALUES (?, ?, ?)";
        result = await db.run(query, [username, password, email]);
        let userId = result["lastID"];
        res.type('text').send("UserID:" + userId);
      } else {
        res.type('text').send("Username already exists");
      }
      await db.close();
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Returns info about all cars for sale. If there's a search query, searches by that.
app.get('/cars', async (req, res) => {
  try {
    let db = await getDBConnection();
    let query = 'SELECT cars.id, name, price, img, userid, username FROM cars, users WHERE ' +
      'cars.userid = users.id AND selling = "yes"';
    let rows = '';
    if (req.query.search) {
      query = query + ' AND (name LIKE ? OR username LIKE ?) ORDER BY cars.id DESC;';
      rows = await db.all(query, '%' + req.query.search + '%', '%' + req.query.search + '%');
    } else {
      query = query + ' ORDER BY cars.id DESC;';
      rows = await db.all(query);
    }
    await db.close();
    if (rows.length === 0 && req.query.search) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('No cars of that name/owner name found!');
    } else if (rows.length === 0) {
      res.type('text').status(SERVER_ERROR)
        .send('No cars for sale found!');
    } else {
      res.json({
        'cars': rows
      });
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Filters
app.get('/filter', async (req, res) => {
  try {
    let db = await getDBConnection();
    let query = setFilterQuery();
    let minCheck = setMin(req.query.min);
    let maxCheck = setMax(req.query.max);
    let fuelCheck = '%%';
    let typeCheck = '%%';
    if (req.query.fuel !== 'all') {
      fuelCheck = req.query.fuel;
    }
    if (req.query.type !== 'all') {
      typeCheck = req.query.type;
    }
    let rows = await db.all(query, minCheck, maxCheck, fuelCheck, typeCheck);
    await db.close();
    if (rows.length === 0) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('No cars matching params found!');
    } else {
      res.json({
        'cars': rows
      });
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Returns detailed information for specific car.
app.get('/car/:id', async (req, res) => {
  try {
    let db = await getDBConnection();
    if (!req.params.id) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('Car ID was not given correctly.');
    }
    let query = 'SELECT cars.id, name, datemade, fuel, type, price, img, descr, selling, userid, ' +
      'username FROM cars, users WHERE cars.userid = users.id AND cars.id = ?;';
    let rows = await db.get(query, req.params.id);
    await db.close();
    if (rows.length === 0) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('Car of that ID was not found.');
    } else {
      res.json(rows);
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Returns cars of a specific user.
app.get('/user/:id', async (req, res) => {
  try {
    let db = await getDBConnection();
    if (!req.params.id) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('User ID was not given correctly.');
    }
    let checkUser = 'SELECT username FROM users WHERE id = ?';
    let name = await db.get(checkUser, req.params.id);
    if (!name) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('User ID does not match existing user.');
    }
    let query = 'SELECT cars.id, name, price, img, userid, username FROM cars, users WHERE ' +
      'cars.userid = users.id AND users.id = ? AND selling = "yes" ORDER BY cars.id DESC;';
    let rows = await db.all(query, req.params.id);
    await db.close();
    res.json({
      'cars': rows,
      'name': name
    });
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Shows transaction history of specific user.
app.get('/history/:id', async (req, res) => {
  try {
    let db = await getDBConnection();
    if (!req.params.id) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('User ID was not given correctly.');
    }
    let query = 'SELECT cars.id, transactions.id AS conf, name, date, seller, username, img, ' +
      'price FROM transactions, cars, users WHERE transactions.seller = users.id AND ' +
      'transactions.car = cars.id AND buyer = ? ORDER BY transactions.date DESC;';
    let rows = await db.all(query, req.params.id);
    await db.close();
    if (rows.length === 0) {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('No transactions made yet.');
    } else {
      res.json({
        'trx': rows
      });
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Buys the given car and adds to transaction history.
app.post('/buy', async (req, res) => {
  try {
    let db = await getDBConnection();
    if (req.body.buyer && req.body.car) {
      let checked = await db.get(setCheckBuyQuery(), req.body.car);
      if (!checked) {
        res.type('text').status(INVALID_PARAM_ERROR)
          .send('Car does not exist.');
      } else if (checked.selling === 'no') {
        res.type('text').status(INVALID_PARAM_ERROR)
          .send('Car is not for sale.');
      } else if (checked.userid === Number(req.body.buyer)) {
        res.type('text').status(INVALID_PARAM_ERROR)
          .send('You cannot buy your own car.');
      } else {
        await db.run(setBuyQuery(), req.body.buyer, req.body.car);
        let add = await db.run(setTrxQuery(), req.body.buyer, Number(checked.userid), req.body.car);
        await db.close();
        res.type('text').send('Transaction #: ' + add.lastID + ', You can see the sale in your ' +
          'transaction history.');
      }
    } else {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('Something went wrong, the car or buyer were not given.');
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

// Adds the given car to be sold to the database.
app.post('/sell', async (req, res) => {
  try {
    let db = await getDBConnection();
    let type = req.body['sell-type'];
    let fuel = req.body['sell-fuel'];
    let name = req.body['sell-name'];
    let price = req.body['sell-price'];
    let made = req.body['sell-made'];
    let img = req.body['sell-img'];
    let desc = req.body['sell-descr'];
    if (name && price && made && desc && img && fuel && type && req.body.seller) {
      await db.run(setSellQuery(), name, made, fuel, type, price, img, desc, req.body.seller);
      await db.close();
      res.type('text').send('Car has been put on sale! You can see the car on your account.');
    } else {
      res.type('text').status(INVALID_PARAM_ERROR)
        .send('Certain car information was not given!');
    }
  } catch (err) {
    res.type('text').status(SERVER_ERROR)
      .send(SERVER_ERROR_MSG);
  }
});

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'cardatabase.db',
    driver: sqlite3.Database
  });
  return db;
}

/**
 * Returns a query to filter the cars database.
 * @returns {string} - Query.
 */
function setFilterQuery() {
  return 'SELECT cars.id, name, price, img, userid, username FROM cars, users WHERE ' +
  'cars.userid = users.id AND selling = "yes" AND price >= ? AND price <= ? AND fuel LIKE ? ' +
  'AND type LIKE ? ORDER BY cars.id DESC;';
}

/**
 * Sets minimum to the given minimum if it exists. Otherwise, sets it to a default value.
 * @param {number} newMin - Given minimum.
 * @returns {number} - Set minimum value.
 */
function setMin(newMin) {
  if (newMin) {
    return newMin;
  }
  return 0;
}

/**
 * Sets maximum to the given maximum if it exists. Otherwise, sets it to a default value.
 * @param {number} newMax - Given maximum.
 * @returns {number} - Set maximum value.
 */
function setMax(newMax) {
  if (newMax) {
    return newMax;
  }
  return MAX;
}

/**
 * Returns a query to check the cars database before buying.
 * @returns {string} - Query.
 */
function setCheckBuyQuery() {
  return 'SELECT userid, selling FROM cars WHERE id = ?;';
}

/**
 * Returns a query to update the cars database.
 * @returns {string} - Query.
 */
function setBuyQuery() {
  return 'UPDATE cars SET selling = "no", userid = ? WHERE id = ?;';
}

/**
 * Returns a query to insert into the transactions database.
 * @returns {string} - Query.
 */
function setTrxQuery() {
  return 'INSERT INTO transactions(buyer, seller, car) VALUES (?, ?, ?);';
}

/**
 * Returns a query to insert into the cars database.
 * @returns {string} - Query.
 */
function setSellQuery() {
  return 'INSERT INTO cars(name, datemade, fuel, type, price, img, descr, userid) ' +
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
}

app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);