import { DataTypes,Model } from 'sequelize';
import sequelize from '../config/db';
import bcrypt from "bcrypt";
import {Post} from "./postModel";
import Comment from "./commentModel";

// Define User model interface
class User extends Model {

}

User.init (
    {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
              msg: 'First name cannot be empty'
            }
          }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
              msg: 'Last name cannot be empty'
            }
          }
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Invalid email address",
            },
            notEmpty: {
                msg: "Email is required"
            }
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        async set(password: string): Promise<void>  {
            const salt= bcrypt.genSaltSync();
            const hash= bcrypt.hashSync(password,salt)
            this.setDataValue('password', hash)
        }
      },
    },

    {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    }
);

// Define User associations

User.hasMany(Post,{onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'userId' },);
Post.belongsTo(User,{onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'userId'});
User.hasMany(Comment,{onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'userId'});
Comment.belongsTo(User,{onDelete:'CASCADE', onUpdate: 'CASCADE',foreignKey: 'userId'});


export default User;