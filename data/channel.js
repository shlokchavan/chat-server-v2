require("../globals");
const messages = global.AllMessages;

const groupedMessages = messages.data.reduce((groups, message) => {
  const conversationId = message.conversationId;
  if (!groups[conversationId]) {
    groups[conversationId] = [];
  }
  groups[conversationId].push(message);
  return groups;
}, {});

const latestMessages = Object.values(groupedMessages).map((group) => {
  const latestMessage = group.reduce((latest, message) => {
    return message.messageId > latest.messageId ? message : latest;
  });
  return latestMessage;
});

const GetAllConversations = {
  ...global.AllMessages,
  data: latestMessages,
};
// console.log("16. GetAllConversations: ", GetAllConversations);
module.exports = {
  GetAllConversations,
};
