import { DataTypes,Model } from 'sequelize';
import sequelize from '../config/db';
import Comment from "./commentModel"
import Category from "./categoryModel"
import PostCategory from './postCategoryModel';

// Define Post model interface
class Post extends Model {}

Post.init (
    {

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'You cannot send an empty post'
                }
                }
            },
        },
    {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
    }
);


// Define posts ralations

Post.belongsToMany(Category, { through: PostCategory,onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'postId'});
Category.belongsToMany(Post, { through: PostCategory,onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'categoryId'});

Post.hasMany(Comment, {onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'postId'});
Comment.belongsTo(Post,{onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'postId'});


export { Post,PostCategory}
