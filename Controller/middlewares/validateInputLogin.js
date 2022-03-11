const emailRequired = '"email" is required';
const passRequired = '"password" is required';
const emailEmpty = '"email" is not allowed to be empty';
const passEmpty = '"password" is not allowed to be empty';
const invalid = 'Invalid fields';

const { User } = require('../../models');

const validateEmail = async (req, res, next) => {
  const { email } = req.body;
  if (typeof email === 'undefined') return res.status(400).json({ message: emailRequired });
  if (email === '') return res.status(400).json({ message: emailEmpty });

  next();
};

const validatePassword = async (req, res, next) => {
  const { password } = req.body;
  if (typeof password === 'undefined') return res.status(400).json({ message: passRequired });
  if (password === '') return res.status(400).json({ message: passEmpty });

  next();
};

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ where: { email }, raw: true, nest: true });

  if (!user || user.email !== email || user.password !== password) {
    return res.status(400).json({ message: invalid });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateLogin,
};