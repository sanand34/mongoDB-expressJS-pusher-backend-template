import express from "express";
const router = express.Router();
import { getPosts, getAll, createPost } from "../controllers/posts.js";
router.get("/", getPosts);
router.get("/messages/sync", getAll);
router.post("/api/messages/new", createPost);
export default router;
