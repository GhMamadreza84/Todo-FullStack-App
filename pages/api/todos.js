import { getSession } from "next-auth/react";
import connectDB from "../../utils/connectDB";
import User from "../../models/User";
import { sortTodos } from "../../utils/sortTodos";

async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", message: "Eror in connecting to DB" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ status: "failed", message: "You are not logged in!" });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "User doesn't exist !" });
  }

  if (req.method === "POST") {
    const { title, description, status } = req.body;

    if (!title || !status) {
      return res
        .status(422)
        .json({ status: "failed", message: "invalid data!" });
    }

    user.todos.push({ title, description, status });
    user.save();

    res.status(201).json({ status: "success", message: "Todo created!" });
  } else if (req.method === "GET") {
    const sortedData = sortTodos(user.todos);
    res.status(200).json({ status: "success", data: { todos: sortedData } });
  } else if (req.method === "GET" && req.query.id) {
    try {
      const { id } = req.query;

      const user = await User.findOne({ email: session.user.email });
      if (!user || !user.todos) {
        return res
          .status(404)
          .json({ status: "failed", message: "User or todos not found!" });
      }

      const todo = user.todos.find((todo) => todo._id.toString() === id);

      if (!todo) {
        return res
          .status(404)
          .json({ status: "failed", message: "Todo not found" });
      }

      res.status(200).json({ status: "success", data: todo });
    } catch (error) {
      console.error("Error in GET handler:", error);
      res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  } else if (req.method === "PATCH") {
    const { id, title, description, status } = req.body;

    // بررسی مقدار `id`
    if (!id) {
      return res
        .status(422)
        .json({ status: "failed", message: "Invalid data: id is required!" });
    }

    // ساخت شیء برای به‌روزرسانی
    const updateData = {};
    if (title) updateData["todos.$.title"] = title;
    if (description) updateData["todos.$.description"] = description;
    if (status) updateData["todos.$.status"] = status;

    try {
      // به‌روزرسانی داده‌ها در دیتابیس
      const result = await User.updateOne(
        { "todos._id": id },
        { $set: updateData }
      );

      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .json({ status: "failed", message: "Todo not found!" });
      }

      res
        .status(200)
        .json({ status: "success", message: "Todo updated successfully!" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "failed", message: "Internal Server Error!" });
    }
  }
}

export default handler;
