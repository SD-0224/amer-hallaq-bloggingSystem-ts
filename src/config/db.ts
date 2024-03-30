// Import the Sequelize module from sequelize-typescript
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";


// initialize configuration
dotenv.config();

// Create a new Sequelize instance with the connection configuration
const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    logging: false,
    models: [__dirname+"../models/userModel",__dirname+"../models/postModel",__dirname+"../models/commentModel",
            __dirname+"../models/categoryModel",__dirname+"../models/postCategoryModel"],
});

sequelize.authenticate()
  .then(() => {
    // tslint:disable-next-line:no-console
     console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    // tslint:disable-next-line:no-console
     console.error('Unable to connect to the database:', err);
  })

// Export the sequelize object as the default module
export default sequelize;