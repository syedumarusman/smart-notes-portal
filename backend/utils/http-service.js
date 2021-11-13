const axois = require("axios").default;

const HTTP = axois.create({
  baseURL: `http://127.0.0.1:5000`,
});

module.exports = { HTTP };
