const posts = require('express').Router();
const { Op } = require('sequelize');
const { BlogPosts } = require('../models');
const { User } = require('../models');
const { Categories } = require('../models');
require('dotenv').config();

const tokenError = require('./middlewares/tokenError');
const { 
  validateTitle,
  validateContent,
  validateCategory,
  categoriesNotEdited,
} = require('./middlewares/validateInputPosts');

posts.post('/', validateTitle, validateContent, validateCategory, tokenError, 
  async (req, res) => {
    await BlogPosts.create(req.body);
    const created = await BlogPosts.findOne({ where: { title: req.body.title },
      attributes: { exclude: ['postId', 'published', 'updated'] } });
      const obj = created.dataValues;
    res.status(201).json(obj);
});

posts.get('/', tokenError, async (_req, res) => {
  const result = await BlogPosts.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Categories, as: 'categories' },
    ],
    raw: true,
    nest: true,
  });
  // peguei a dica de fazer o map com o Rogerio. o cara é diferenciado!!
  const resultMap = result.map((e) => ({
    ...e, categories: [e.categories],
  }));
  res.status(200).json(resultMap);
});

posts.get('/search', tokenError, async (req, res) => {
  const { q } = req.query;
  const result = await BlogPosts.findAll({ 
    where: { [Op.or]: [{ title: { [Op.substring]: q } }, { content: { [Op.substring]: q } }] },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Categories, as: 'categories' },
    ],
    raw: true,
    nest: true,
  });
  const resultMap = result.map((e) => ({
    ...e, categories: [e.categories],
  }));
  res.status(200).json(resultMap);
});

posts.get('/:id', tokenError, async (req, res) => {
  const { id } = req.params;
  const result = await BlogPosts.findOne({ where: { id },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Categories, as: 'categories' },
    ],
    raw: true,
    nest: true,
  });
  if (!result) {
    return res.status(404).json({ message: 'Post does not exist' });
  }
  const arr = [];
  arr.push(result);
  const resultMap = arr.map((e) => ({
    ...e, categories: [e.categories],
  }));
  res.status(200).json(resultMap[0]);
});

posts.put('/:id', validateTitle, validateContent, categoriesNotEdited, tokenError, 
  async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const i = Number(id);
    if (i !== userId) return res.status(401).json({ message: 'Unauthorized user' });
    await BlogPosts.update({ title: req.body.title, content: req.body.content }, {
      where: { id },
    });
    const result = await BlogPosts.findOne({ where: { id },
      include: [
        { model: Categories, as: 'categories' },
      ],
      raw: true,
      nest: true,
    });
    const value = {
      ...result, categories: [result.categories],
    };
    res.status(200).json(value);
});

posts.delete('/:id', tokenError, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const i = Number(id);
  const result = await BlogPosts.findOne({ where: { id },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Categories, as: 'categories' },
    ],
    raw: true,
    nest: true,
  });
  if (!result) {
    return res.status(404).json({ message: 'Post does not exist' });
  }
  if (i !== userId) return res.status(401).json({ message: 'Unauthorized user' });
  await BlogPosts.destroy({ where: { id } });
  res.status(204).end();
});

module.exports = posts;