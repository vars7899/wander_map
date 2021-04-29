const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
    try {
        //genrate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user and send response
        const user = await newUser.save();
        res.status(200).json({
            sucess: true,
            msg: "user created",
            user_id: user._id,
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        // find user
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(404).json("Wrong Username or Password");

        // validate user
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !validPassword && res.status(400).json("Wrong Username or Password");

        // send response
        res.status(200).json({ user: user._id, username: user.username });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;
