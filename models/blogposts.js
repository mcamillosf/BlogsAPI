module.exports = (sequelize, DataTypes) => {
  const BlogPosts = sequelize.define('BlogPosts', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      published: DataTypes.DATE,
      updated: DataTypes.DATE,
    }, { sequelize, modelName: 'BlogPosts', timestamps: false });
  BlogPosts.associate = (models) => {
    BlogPosts.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    BlogPosts.hasOne(models.PostsCategories, { foreignKey: 'catergoryId' });
    BlogPosts.hasOne(models.Categories, { foreignKey: 'id', as: 'categories' });
  };
  return BlogPosts;
};
