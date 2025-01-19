import { getSession } from "next-auth/react";
import connectDB from "../../utils/connectDB";
import User from "../../models/User";
import { verifyPassword } from "../../utils/auth";

async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "Erorr in connecting to DB" });
  }

  const session = await getSession({ req });
  console.log(session);
  if (!session) {
    return (
      res.status(401),
      json({ status: "failed", message: "you are not logged in!" })
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "User doesen't exist! " });
  }

  if (req.method === "POST") {
    const { name, lastName, password } = req.body;

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(422).json({
        status: "failed",
        message: "password is incorrect!",
      });
    }

    user.name = name;
    user.lastName = lastName;
    user.save();

    res.status(200).json({
      status: "success",
      data: { name, lastName, email: session.user.email },
    });
  } else if (req.method === "GET") {
    res.status(200).json({
      status: "success",
      data: { name: user.name, lastName: user.lastName, email: user.email },
    });
  } else if (req.method === "PUT") {
    const { name, lastName, email } = req.body;

    if (!name || !lastName || !email) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required!",
      });
    }

    try {
      console.log("Attempting to update user profile...");
      const result = await User.updateOne(
        { email },
        { $set: { name, lastName, email } }
      );

      if (result.modifiedCount === 1) {
        console.log("Profile updated successfully.");
        return res.status(200).json({
          status: "success",
          message: "Profile updated successfully!",
        });
      } else {
        console.log("User not found.");
        return res.status(404).json({ message: "User not found." });
      }
    } catch (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default handler;
