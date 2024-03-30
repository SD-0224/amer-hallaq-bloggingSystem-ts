import dotenv from "dotenv";
import express, { Request, Response, Application } from 'express';
import ejs from "ejs";
import morgan from "morgan";
import path from "path";
import sequelize from "./config/db";
import user_routes from "./routes/user_routes"
import post_routes from "./routes/post_routes"
import cors from "cors"
import cookieParser from 'cookie-parser';
import User from './models/userModel';
import {isCurrentUser} from './middleware/isAuthorized'

// initialize configuration
dotenv.config();


// const fileName = fileURLToPath(import.meta.url);
// const dirName = path.dirname(fileName);

const app: Application = express();
// Use morgan middleware with the "combined" format
app.use(morgan('dev'));

// Use cookie-parser middleware
app.use(cookieParser());


app.use(cors());

// To access Bootstrap Files
app.use('/',express.static("./node_modules/bootstrap/dist/"));

// To access static files
app.use(express.static(path.join(__dirname,'public')));

// register view engine - it checks views folder by default
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// Data coming from HTML forms
app.use(express.urlencoded({ extended: true }));

// Data coming as JSON - POSTMAN for instace
app.use(express.json());




// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const start= async():Promise<void> => {
    try {
        await sequelize.sync({ alter: true });
        // tslint:disable-next-line:no-console
        console.log(`Databases synced Successfully`);
        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`Server running at http://localhost:${port}`);
        });


    } catch(error) {
        // tslint:disable-next-line:no-console
        console.error(error);
        // Exits the process with an error status code
        process.exit(1);
    }


}
// Invokes the function to start the server
void start()

app.get('*', isCurrentUser);

app.get('/', (req:Request,res:Response,err:any) => {

    res.render('index',{currentUser:req.user});
});

// use routes in the routes folder
app.use(user_routes);
app.use(post_routes);

// If route does not exist, redirect to the root
app.use((req:Request,res:Response,err:any) => {

    res.redirect('/',)
});

export default app;