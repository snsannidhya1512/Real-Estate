// import User from "../models/user.model.js";
// import bcryptjs from "bcryptjs";
// import { errorHandler } from "../utils/error.js";

// export const test = (req, res) => {
//   res.json({
//     message: "API route is working",
//   });
// };

// export const updateUser = async (req, res, next) => {
//   if (req.user.id != req.params.id) {
//     return next(errorHandler(401, "You can only update your own account"));
//   }

//   try {
//     if (req.body.password) {
//       req.body.password = bcryptjs.hashSync(req.body.password, 10);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password,
//           avatar: req.body.avatar,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return next(errorHandler(404, "User not found"));
//     }

//     const { password, ...rest } = updatedUser._doc;

//     res.status(200).json(rest);
//   } catch (error) {
//     next(error);
//   }
// };

// controllers/user.controller.js
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    const { username, email, password, avatar } = req.body;

    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = bcryptjs.hashSync(password, 10);
    if (avatar) updatedFields.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password: omitPassword, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account "));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserLiisting = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};
