//importing
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import postRoutes from "./routes/posts.js";

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({});

//middleware
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

//db config
mongoose.connect("", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log("A change occured", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//api routes
app.get("/", postRoutes);

app.get("/messages/sync", postRoutes);

app.post("/api/messages/new", postRoutes);

//listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
