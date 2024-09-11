import { Router } from "express";
import passport from "passport";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { Users } from "../mongoose/schemas/user.mjs";
import "../passport/localStategy/local.mjs"
import { hashPassword } from "../utils/helper.mjs";


const route = Router();

route.post(
  "/api/userRegistration",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());
    const data = matchedData(request);
    data.password = hashPassword(data.password)
    const user = new Users(data);
    try {
      const savedUser = await user.save();
      return response
        .status(201)
        .send({ msg: "succecsfully register", savedUser });
    } catch (error) {
      console.log(error);
      return response.sendStatus(400);
    }
  }
);


route.post('/api/userLogin', passport.authenticate("local"), (request, response) => {

response.status(200).send({msg: "Succesfully Login"})  
})

route.get("/api/userLogin/status", (request, response) => {
  console.log("inside /api/auth/login/status");
  console.log(request.user);
  console.log(request.session);
  console.log(request.sessionID)
  return request.user ? response.send(request.user) : response.sendStatus(401);
});


route.post('/api/userLogout', (request, response) => {
  if(!request.user) return response.sendStatus(401);
  request.logOut((err) => {
    if(err) return response.sendStatus(400)
    return response.send(200)
  })
})


export default route;
