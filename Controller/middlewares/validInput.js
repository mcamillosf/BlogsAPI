const disName = '"displayName" length must be at least 8 characters long';
const passLength = '"password" length must be 6 characters long';
const passRequired = '"password" is required';
const emailInvalid = '"email" must be a valid email';
const emailRequired = '"email" is required';
const userExist = 'User already registered';

const { User } = require('../../models');

const validateName = (req, res, next) => {
  const { displayName } = req.body;
  if (!displayName) return res.status(400).json({ message: disName });
  if (displayName.length < 8) return res.status(400).json({ message: disName });

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const isValid = /\S+@\S+\.\S+/;
  const validationEmail = isValid.test(email);

  if (!email) return res.status(400).json({ message: emailRequired });
  if (!validationEmail) return res.status(400).json({ message: emailInvalid });

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: passRequired });
  if (password.length < 6) return res.status(400).json({ message: passLength });

  next();
};

const existenteEmail = async (req, res, next) => {
  const { email } = req.body;
  const exist = await User.findOne({ where: { email } });

  if (exist) return res.status(409).json({ message: userExist });

  next();
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  existenteEmail,
};
