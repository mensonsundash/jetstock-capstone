const express = require("express"); // importing express module
const app = express(); // creating express app

const PORT = 3000;

// parse requests of content-type = application/json
app.use(express.json());



//server is litening port
app.listen(PORT, () => {
    console.log(`App is listening on http:localhost: ${PORT}`);
})