const express = require("express"); // importing express module
const cors = require("cors"); // importing cors module
require("dotenv").config(); // dotenv config import before db connection

const app = express(); // creating express app
const PORT = process.env.PORT || 3000;

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

// checking if node environemtn is not test
if(process.env.NODE_ENV !== "test"){

    //help to connect database directly as connection function already called inside it
    const { connecDB } = require("./config/db.config");
    
    (async() => {
        try{
            //connecting db
            await connecDB();

             //server is listening port
            app.listen(PORT, () => {
                console.log(`App is listening on http:localhost: ${PORT}`);
            })     

        }catch(error) {
            console.error(`Failed to start server:${error.message}`);
            process.exit(1);
        }
    })();

}

// exporting server & making available for tests
module.exports = app;
