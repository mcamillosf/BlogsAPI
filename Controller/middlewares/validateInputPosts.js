const titleRequired = '"title" is required';
const contentRequired = '"content" is required';
const categoryRequired = '"categoryIds" is required';
const categoryNotFound = '"categoryIds" not found';

const { Categories } = require('../../models');

const validateTitle = (req, res, next) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: titleRequired });

  next();
};

const validateContent = (req, res, next) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: contentRequired });

  next();
};

const validateCategory = async (req, res, next) => {
  const { categoryIds } = req.body;

  if (!categoryIds) return res.status(400).json({ message: categoryRequired });

  const all = await Categories.findAll({ attributes: { exclude: ['categoryId'] } });
  const teste = all.map((e) => e.dataValues.id);
  const arr = [];
  Promise.all(categoryIds.map(async (each) => {   
    if (!teste.includes(each)) {
      arr.push(each);
    }
  }));
  if (arr.length >= 1) {
    return res.status(400).json({ message: categoryNotFound });
  }

  next();
};

const categoriesNotEdited = async (req, res, next) => {
  const { categories, categoryIds } = req.body;
  if (categories || categoryIds) {
    return res.status(400).json({ message: 'Categories cannot be edited' });
  }

  next();
};

module.exports = {
  validateTitle,
  validateContent,
  validateCategory,
  categoriesNotEdited,
};
