// import express from "express";
// import { test, updateUser } from "../controllers/user.controller.js";
// import { verifyToken } from "../utils/verifyUser.js";

// const router = express.Router();

// router.get("/test", test);
// router.post("/update/:id", verifyToken, updateUser);

// export default router;

// routes/user.route.js
import express from "express";
import {
  deleteUser,
  getUser,
  getUserLiisting,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserLiisting);
router.get("/:id", verifyToken, getUser);

export default router;
