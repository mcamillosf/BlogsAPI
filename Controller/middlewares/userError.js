const dontExist = 'User does not exist';

const { User } = require('../../models');

const notExist = async (req, res, next) => {
  const { id } = req.params;

  const notFounded = await User.findOne({ where: { id } });

  if (!notFounded) {
    return res.status(404).json({ message: dontExist });
  }

  next();
};

module.exports = notExist;