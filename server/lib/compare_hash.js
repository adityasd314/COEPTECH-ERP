const bcrypt = require("bcrypt");

const compareHash = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = compareHash;
