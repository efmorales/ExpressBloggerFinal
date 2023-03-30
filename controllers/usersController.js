const User = require("../models/Users");
const {
    generatePasswordHash,
    validatePassword,
    generateUserToken,
    verifyToken
} = require('../auth');
const db = require("../mongoose");

async function registerUser(req, res) {
    try {
        const { email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await generatePasswordHash(password, saltRounds);


        const newUser = new User({
            email,
            password: hashedPassword,
        });

        const isValid = await newUser.validateSync();

        if (isValid) {
            res.json({
                success: false,
                error: isValid
            });
            return;
        }
        // save our new entry to the database
        const savedData = await newUser.save();

        // return the successful request to the user
        res.json({
            success: true,
            user: savedData
        });
    } catch (error) {
        res.json({
            success: false,
            message: "User registration failed",
            error: error.message
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.json({
                success: false,
                message: "User not found"
            }).status(204);
            return;
        }

        const isValid = await validatePassword(password, user.password);
        if (!isValid) {
            res.json({
                success: false,
                message: "Invalid password"
            }).status(204);
            return;
        }

        const userType = email.includes("@hey.com") ? "admin" : "user";

        const data = {
            date: new Date(),
            userID: user.id,
            scope: userType,
            email
        }

        const token = generateUserToken(data);

        res.json({
            success: true,
            message: "User logged in successfully",
            token,
            userType,
            email: user.email,
            userID: user.id,
        }).status(200);

        return;

    } catch {
        res.json({
            success: false,
            message: "User login failed"
        }).status(500);
        return;
    }
}

async function getMessage(req, res) {
    try {
        const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        const token = req.headers[tokenHeaderKey];
        const decoded = verifyToken(token);

        if (!decoded) {
            res.json({
                success: false,
                message: "Invalid token"
            }).status(401);
            return;
        }

        const userData = decoded.userData;

        if (userData && userData.scope === "user") {
            return res.json({
                success: true,
                message: `I'm a normal user with the email ${userData.email}`,
                
            }).status(200);
        }

        if (userData && userData.scope === "admin") {
            return res.json({
                success: true,
                message: `I'm an admin user with the email ${userData.email}`,
                
            }).status(200);
        }

        throw Error ("access denied");

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        }).status(401);

    }
}

async function logOutUser(req, res) {
    try {
      const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
      const token = req.headers[tokenHeaderKey];
      const decoded = verifyToken(token);
  
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid token"
        });
      }
  
      const userData = decoded.userData;
  
      if (userData && userData.scope === "user") {
        // Remove user's token from database
        await User.updateOne({ _id: userData._id }, { $unset: { authToken: 1 } });
        return res.status(200).json({
          success: true,
          message: "Logged out successfully"
        });
      }
  
      if (userData && userData.scope === "admin") {
        // Remove user's token from database

        await User.updateOne({
            _id: userData._id
            }, {
            $unset: {
                authToken: 1
            }
        })
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
        }
  
      throw Error("Access denied");
  
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

module.exports = {
    registerUser,
    loginUser,
    getMessage,
    logOutUser,
}