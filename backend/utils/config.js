require("dotenv").config();

const MONGODB_URL = process.env.NODE_ENV === 'test'   ? process.env.TEST_MONGODB_URL  : process.env.MONGODB_URL;
const PORT = process.env?.PORT || 3003;


if(!MONGODB_URL) {
  console.log("No mongo db url found!")
  process.exit(1);
}

module.exports = { MONGODB_URL, PORT }
