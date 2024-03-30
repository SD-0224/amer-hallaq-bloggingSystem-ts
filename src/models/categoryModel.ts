import { DataTypes,Model } from 'sequelize';
import sequelize from '../config/db';

// Define Post model interface
class Category extends Model {}

Category.init (
    {

        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Title is required'
                }
                }
            },
        },
    {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
    }
);




export default Category