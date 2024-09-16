import passport from "passport";
import { Strategy } from "passport-local";
import { Users } from "../../mongoose/schemas/user.mjs";
import { comparedPassword } from "../../utils/helper.mjs";

export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log(`username :${username}`);
    console.log(`password :${password}`);

    try {
      const findUser = await Users.findOne({ username });
      if (!findUser) {
        return done(null, false, { msg: "user not found", succes: false });
      }
      if (!comparedPassword(password, findUser.password)) {
        return done(null, false, { msg: "password not match!", succes: false });
      }
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("inisde serialize user");
  console.log(`this is the new user -- >${user}`);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("inisde Deserialize ");
  console.log(`deseriliazing user id: ${id}`);
  try {
    const findUser = await Users.findById(id);
    if (!findUser) throw new Error("user not found!");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});
