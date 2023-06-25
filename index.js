const socketIO = require("socket.io");
const cors = require("cors");
const app = require("express")();
const http = require("http").Server(app);
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { VerifyUser } = require("./service/user.service");
const { ListAllChannels } = require("./service/channel.service");
const {
  GetAllMessagesByConvId,
  SendMessage,
} = require("./service/message.service");

const io = require("socket.io")(http, {
  cors: {
    // origin: "*" || "http://localhost:4200" || "http://revenuemaximizers.com",
    // origin: "http://rm.pentaknot.com",
    // origin: [
    //   "http://localhost:4200",
    //   "http://rm.pentaknot.com",
    //   "https://revenuemaximizers.com",
    // ],
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true,
  },
});
// Keep track of message history for each channel
const messageHistory = new Map();

// Enable CORS for all routes
app.use(cors());

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  // fetch token from handshake auth sent by FE
  console.log("token: ", token);
  if (!token) {
    return;
  }
  try {
    // verify jwt token and get user data
    const user = await VerifyUser(token);
    console.log("44. user", user.data);
    if (user.data.status == "success") {
      socket.user = user.data;
      next();
    } else if (user.data.status == "error") {
      console.log("49. err: ", user.data.message);
      next(new Error(user.data.message));
    }
    // save the user data into socket object, to be used further
  } catch (e) {
    // if token is invalid, close connection
    console.log("54. error", e.message);
    return next(new Error(e.message));
  }
});

io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    console.log("A user connected");

    getAllChannels(socket, token);
    // Join a channel
    socket.on("join-channel", async (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation ${conversationId}`);
      //   Get Previous messages from that channel
      const messages = await getMessages(conversationId, token);
      //   console.log("Total messages: ", messages?.data?.length);
      io.to(socket.id).emit("channel-history", messages);
      //   // Emit message history for the channel, if available
      //   const channelHistory = messageHistory.get(conversationId) || [];
      //   io.to(socket.id).emit("channel-history", channelHistory);
    });

    // Leave a channel
    socket.on("leave-channel", (conversationId) => {
      socket.leave(conversationId);
      console.log(`User left channel ${conversationId}`);
    });

    socket.on("channel-message", async (data) => {
      console.log("channel-message: ", data);
      //   Send Message Persist to DB
      const res = await SendMessage(data, token);
      console.log("post send msg: ", res);

      io.to(data?.conversationId).emit("channel-message", data);
      //   Get Previous messages from that channel
      const messages = await getMessages(data?.conversationId, token);
      //   console.log("Total messages: ", messages?.data?.length);
      io.to(data?.conversationId).emit("channel-history", messages);
      // Update message history for the channel
      //   let channelHistory = messageHistory.get(conversationId);
      //   if (!channelHistory) {
      //     channelHistory = [];
      //     messageHistory.set(conversationId, channelHistory);
      //   }
      //   channelHistory.push(data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  } catch (err) {
    console.log("connection error: ", err.message);
  }
});

// Helper Function

const getAllChannels = async (socket, token, where=socket.id) => {
  //   List All Channels
  const channelList = await ListAllChannels(token);
  console.log("Total Channels: ", channelList?.data?.length);
  io.to(where).emit("channel-list", channelList);
};

const getMessages = async (id, token) => {
  const messages = await GetAllMessagesByConvId(id, token);
  return messages;
};

app.get("/", (req, res) => {
  res.send("Chat server is running.");
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
