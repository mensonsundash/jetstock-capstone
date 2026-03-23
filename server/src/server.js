const express = require("express"); // importing express module
const app = express(); // creating express app

const PORT = 3000;

// parse requests of content-type = application/json
app.use(express.json());

//testing api route health
app.get("/", (req, res) => {
    res.status(200).json({message: 'JetStock backend is running'})
})

//server is litening port
app.listen(PORT, () => {
    console.log(`App is listening on http:localhost: ${PORT}`);
})