const express = require("express"); // importing express module
const app = express(); // creating express app

//dotenv config import before db connection
require("dotenv").config();
const PORT = process.env.PORT || 3000;

//help to connect database directly as connection function already called inside it
require("./config/db.config");

// parse requests of content-type = application/json
app.use(express.json());

//testing api route health
app.get("/", (req, res) => {
    res.status(200).json({message: 'JetStock backend is running'})
})

//main api routes (path to all routes)
app.use("/api", require("./routes"));

//server is listening port
app.listen(PORT, () => {
    console.log(`App is listening on http:localhost: ${PORT}`);
})