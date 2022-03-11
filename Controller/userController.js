const users = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const tokenError = require('./middlewares/tokenError');
const userError = require('./middlewares/userError');

const { 
  validateName, 
  validateEmail, 
  validatePassword, 
  existenteEmail,
} = require('./middlewares/validInput');

users.post('/', 
validateName, validateEmail, validatePassword, existenteEmail, 
async (req, res) => {
const user = await User.create(req.body);
const userid = user.dataValues.id;
const codToken = jwt.sign({ token: userid }, process.env.JWT_SECRET);
return res.status(201).json({ token: codToken });
});

users.get('/', tokenError, async (_req, res) => {
const listOfUsers = await User.findAll();
res.status(200).json(listOfUsers);
});

users.get('/:id', tokenError, userError, async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  return res.status(200).json(user);
});

users.delete('/me', tokenError, async (req, res) => {
  const { userId } = req.body;
  await User.destroy({ where: { id: userId } });
  res.status(204).end();
});

module.exports = users;