const axios = require("axios");
const { url } = require("./../baseURL");
require("../globals");
const { GetMessagesByConversationId } = require("../data/messages");

function GetAllMessagesByConvId(id, authToken) {
  //   return axios.get(`${url}/subscription-service/sub/user/0/verifyUser`, {
  //     headers: { Authorization: `${authToken}` },
  //   });

  // return GetMessagesByConversationId;
  // console.log(GetMessagesByConversationId);
  return {
    ...GetMessagesByConversationId,
    data: GetMessagesByConversationId?.data.filter(
      (message) => message.conversationId == id
    ),
  };

  //   return axios.get("../json/get-all-conversations.json");
}

function SendMessage(payload, authToken) {
  // return axios.post(`${url}/message-service/msgConversation`, payload, {
  //   headers: { Authorization: `${authToken}` },
  // });
  global.AllMessages.data.push({
    messageId: Math.ceil(Math.random() * 10000),
    ...payload,
  });
  console.log("Updated messages: ", global.AllMessages);
  return global.AllMessages;
}

module.exports = {
  GetAllMessagesByConvId,
  SendMessage,
};
