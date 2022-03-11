const categories = require('express').Router();
const { Categories } = require('../models');
require('dotenv').config();

const tokenError = require('./middlewares/tokenError');

categories.post('/', tokenError, async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: '"name" is required' });

  await Categories.create(req.body);
  const finded = await Categories.findOne({ where: { name }, 
    attributes: { exclude: ['categoryId'] } });
  res.status(201).json(finded);
});

categories.get('/', tokenError, async (req, res) => {
  const listOfCategories = await Categories.findAll({ attributes: { exclude: ['categoryId'] } });
  res.status(200).json(listOfCategories);
});

module.exports = categories;