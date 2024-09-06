import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import route from "./routes/user.mjs";
import passport from "passport";


const app = express();

mongoose
  .connect("mongodb://localhost/localUsers")
  .then(() => console.log("database connected"))
  .catch((err) => console.log(`an error occured: ${err}`));


app.use(express.json());
 //app.use(express.urlencoded({ extended: true }));
// app.use(
//     session({
//       secret: "ralph the dev",
//       saveUninitialized: false,
//       resave: false,
//       cookie: {
//         maxAge: 60000 * 60,
//       },
//       //this one is for persisted state
//     //   store: MongoStore.create({
//     //     client: mongoose.connection.getClient()
//     //   })
//     })
//   );
  
//   app.use(passport.initialize());
//   app.use(passport.session());

app.use(route)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("local 3000 is listening");
});
