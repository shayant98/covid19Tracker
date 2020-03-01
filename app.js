const express = require("express");

const ejs = require("ejs");


const baseRoutes = require("./routes/baseRoutes")


const app = express();
app.set('view engine', 'ejs');
app.set("views", "views")
const port = 3000


app.use("/", baseRoutes)

app.listen(port)