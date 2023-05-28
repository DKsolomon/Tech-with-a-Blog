const User = require('./user');
const Post = require('./post')
const Comment = require('./comment')


User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  
Post.belongsTo(User, {
    foreignKey: 'user_id',
  });

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
})
 
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
})

Comment.belongsTo(User, {
  foreignKey: 'user_id'
})

User.hasMany(Comment, {
foreignKey: 'user_id',
onDelete: 'CASCADE'
})

module.exports = { User, Post, Comment };