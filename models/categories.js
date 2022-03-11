module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Categories',
    timestamps: false,
  });

  Categories.associate = (models) => {
    Categories.belongsToMany(models.PostsCategories, 
      { through: Categories, foreignKey: 'id', otherKey: 'id', as: 'categories' });
  };

  return Categories;
};