const axios = require("axios");
const { url } = require("./../baseURL");

function VerifyUser(authToken) {
  return axios.get(`${url}/subscription-service/sub/user/0/verifyUser`, {
    headers: { Authorization: `${authToken}` },
  });
}

module.exports = {
  VerifyUser,
};
