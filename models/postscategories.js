module.exports = (sequelize, _DataTypes) => {
  const PostsCategories = sequelize.define('PostsCategories', {}, {
    sequelize,
    modelName: 'PostsCategories',
    timestamps: false,
  });
  
  PostsCategories.associate = (models) => {
    PostsCategories.belongsTo(models.Categories, {
      through: PostsCategories,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
    
    PostsCategories.belongsTo(models.BlogPosts, {
      through: PostsCategories,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
  };

  return PostsCategories;
};