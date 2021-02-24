import {Router} from "express";
import { UserController } from "./controllers/UsersController";
import { SurveysController } from "./controllers/SurverysController"

const router = Router();

const userController = new UserController();
const surveyController = new SurveysController();

router.post("/users", userController.create);
router.get("/users", userController.show);
router.post("/surveys",surveyController.create)
router.get("/surveys",surveyController.show)

export {router};
