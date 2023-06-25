const axios = require("axios");
const { url } = require("./../baseURL");
const { GetAllConversations } = require("../data/channel");

function ListAllChannels(authToken) {
  //   return axios.get(`${url}/subscription-service/sub/user/0/verifyUser`, {
  //     headers: { Authorization: `${authToken}` },
  //   });

  return GetAllConversations;

  //   return axios.get("../json/get-all-conversations.json");
}

module.exports = {
  ListAllChannels,
};
