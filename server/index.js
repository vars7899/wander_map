const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const pinRoute = require("./Routes/Pin.routes.js");
const userRoute = require("./Routes/User.routes.js");

const app = express();
dotenv.config();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("../client/build"));
}

app.listen(PORT, () => {
    console.log(`Server UP on PORT ${PORT}`);
});
