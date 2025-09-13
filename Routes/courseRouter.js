import express from "express";
import { getDashboardData, getCourses,createCourse,updateCourse,getCourseById} from "../Controllers/courseControlers.js";

const courseRouter = express.Router();

courseRouter.get("/dashboard", getDashboardData);
courseRouter.get("/", getCourses);              
courseRouter.get("/:id", getCourseById);

courseRouter.post("/",createCourse);     
courseRouter.put("/:id", updateCourse);   

export default courseRouter;
