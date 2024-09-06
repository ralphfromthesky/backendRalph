import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { Users } from "../mongoose/schemas/user.mjs";

const route = Router();

route.post(
  "/api/userRegistration",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());
    const data = matchedData(request);

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



route.post('/api/userLogin', (request, response) => {

})

export default route;
