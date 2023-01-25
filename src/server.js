const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const routes = require('../routes/routes')
require("dotenv").config();
const path = require("path")

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGOOSE_URL_CONNECTION, () => {
    console.log("Mongoose connected")
})

// Use this to do tests
// if (process.env.ENVIRONMENT === "production") {
//     app.use(express.static(path.join("../front-end/build")));
//     app.get("/", (req, res) => {
//         res.sendFile(path.join(_dirname, 'build', 'index.html'))
//     })
// }

app.use(express.json());
app.use(cors())
app.use("/api", routes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})