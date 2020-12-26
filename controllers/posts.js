import Messages from "../models/dbMessages.js";
export const getPosts = (req, res) => {
  res.send("This works");
};
export const getAll = async (req, res) => {
  try {
    const postMessages = await Messages.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Messages(post);

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
