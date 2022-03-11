const login = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models');

const {
  validateEmail,
  validatePassword,
  validateLogin,
} = require('./middlewares/validateInputLogin');

login.post('/', validateEmail, validatePassword, validateLogin,
 async (req, res) => {
   const { email } = req.body;
   const user = await User.findOne({ where: { email } });
   const userid = user.dataValues.id;
   const codToken = jwt.sign({ userid }, process.env.JWT_SECRET);
   return res.status(200).json({ token: codToken });
});

module.exports = login;