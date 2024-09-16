import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import route from "./routes/user.mjs";
import passport from "passport";
import MongoStore from "connect-mongo"; // session persisted state
import cors from 'cors';



const app = express();

mongoose
  .connect("mongodb://localhost/localUsers")
  .then(() => console.log("database connected"))
  .catch((err) => console.log(`an error occured: ${err}`));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: "ralph the dev",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60,
        httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      },
      // this one is for persisted state if server goes down it wil reconnect session
      store: MongoStore.create({
        client: mongoose.connection.getClient()
      })
    })
  );
  
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use(route)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("local 3000 is listening");
});
