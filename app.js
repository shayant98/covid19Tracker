const express = require("express");

const ejs = require("ejs");


const baseRoutes = require("./routes/baseRoutes")


const app = express();
app.set('view engine', 'ejs');
app.set("views", "views")
app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 3000


app.use("/", baseRoutes)

app.listen(port)