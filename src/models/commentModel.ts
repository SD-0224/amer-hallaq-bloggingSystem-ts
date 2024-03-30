import { DataTypes,Model } from 'sequelize';
import sequelize from '../config/db';

// Define Post model interface
class Comment extends Model {}

Comment.init (
    {

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'You cannot send an empty comment'
                }
                }
            },
        },
    {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
    }
);




export default Comment