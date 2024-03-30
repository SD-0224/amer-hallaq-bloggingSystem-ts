import { DataTypes,Model } from 'sequelize';
import sequelize from '../config/db';

// Define the joining table posts-categories
class PostCategory extends Model {}

PostCategory.init (
    {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            }
    },
    {
        sequelize,
        modelName: 'PostCategory',
        tableName: 'postcategories',
    }
);

export default PostCategory;
