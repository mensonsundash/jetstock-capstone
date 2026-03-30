const express = require("express"); // importing express module
const app = express(); // creating express app

//dotenv config import before db connection
require("dotenv").config();

const cors = require("cors"); // importing cors module
const PORT = process.env.PORT || 3000;

//help to connect database directly as connection function already called inside it
require("./config/db.config");

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.JETSTORE_URL],
    credentials: true
}));
// parse requests of content-type = application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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