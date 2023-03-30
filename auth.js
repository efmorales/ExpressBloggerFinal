const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generatePasswordHash = async (password, saltRounds) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt)
    return hash;
}

const validatePassword = async (password, hashedPassword) => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
}

const generateUserToken = (userData) => {
    const exp = Math.floor(Date.now() / 1000) + (60 * 60);
    const payload = {
        userData,
        exp: exp
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(payload, jwtSecretKey);
    return token;

}

const verifyToken = (token) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey);
    console.log(decoded);
    return decoded;
}

module.exports = {
    generatePasswordHash,
    validatePassword,
    generateUserToken,
    verifyToken
};