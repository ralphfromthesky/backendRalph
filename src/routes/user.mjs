import { Router } from "express";
import passport from "passport";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { Users } from "../mongoose/schemas/user.mjs";
import "../passport/localStategy/local.mjs";
import { hashPassword } from "../utils/helper.mjs";

const route = Router();

route.post(
  "/api/userRegistration",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);

    // if (!result.isEmpty()) return response.status(400).send(result.array());
    if (!result.isEmpty())
      return response.status(200).json({
        content: {
          msg: "validatipn failed",
          success: false,
          error: result.array(),
        },
      });

    const data = matchedData(request);
    data.password = hashPassword(data.password);
    const user = new Users(data);
    try {
      const savedUser = await user.save();
      return response.status(201).json({
        msg: "Succesfully register!",
        success: true,
      });
      // .send({ msg: "succecsfully register", savedUser });
    } catch (error) {
      console.log(error);
      return response.sendStatus(400);
    }
  }
);

route.post("/api/userLogin", (request, response, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Passes errors to the error handler
    }
    if (!user) {
      return response.status(401).send(info); // Sends the failure message
    }
    request.logIn(user, (err) => {
      if (err) {
        return next(err); // Error occurred during login
      }
      return response.status(200).send({ msg: "Successfully logged in" });
    });
  })(request, response, next);
});

// const isAuthenticated = (request, response, next) => {
//   if (request.isAuthenticated()) {
//     return next();
//   }
//   return response.status(401).send({ msg: "Unauthorized!" });
// };

route.get("/api/userLogin/status", (request, response) => {
  console.log("inside /api/auth/login/status");
  console.log(` this is the user --> ${request.user}`);
  console.log(`this is his session ---> ${request.session}`);
  console.log(`this is his session ID ---> ${request.sessionID}`);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

route.post("/api/userInformation", async (request, response) => {
  if (request.user) {
    try {
      const { fullname, age, location, emailAddress, contact, address } =
        request.body;
      const updateUser = await Users.findByIdAndUpdate(
        request.user,
        { fullname, age, location, emailAddress, contact, address },
        { new: true, runValidators: true }
      );

      if (!fullname || fullname.trim() === "") {
        return response.send({ msg: "full name is required", succes: "false" });
      }
      if (
        !emailAddress ||
        !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(emailAddress)
      ) {
        return response.status(400).json({ msg: "Invalid email address" });
      }
      if (!updateUser) {
        return response
          .status(404)
          .send({ msg: "user not found", success: "false" });
      }
      return response.status(200).json({
        msg: "User information updated successfully",
        succes: "true",
        // user: updateUser,
      });
    } catch (error) {
      console.log;
    }
  } else {
    response.sendStatus(401);
  }
});

route.get("/api/userInformation", async (request, response) => {
  if (request.user) {
    try {
      const user = await Users.findById(request.user._id).select(
        "fullname age address contact emailAddress -_id"
      );
      if (!user) {
        return response.status(401).send({ msg: "user not founc", success: false});
      }
      // return response.status(200).json(user);
      return response.status(200).json({
        fullname: user.fullname,
        age: user.age,
        address: user.address,
        contact: user.contact,
        emailAddress: user.emailAddress
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ msg: "server error!", succes: false });
    }
  } else {
    return response.sendStatus(401);
  }
});

route.post("/api/userLogout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logOut((err) => {
    if (err) return response.sendStatus(400);
    return response.send(200);
  });
});

export default route;
