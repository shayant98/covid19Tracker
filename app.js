const express = require("express");


const baseRoutes = require("./routes/baseRoutes");
const apiRoutes = require("./routes/apiRoutes");



const app = express();

app.set('view engine', 'ejs');
app.set("views", "views");
app.use(express.static(__dirname + '/public'));


const port = process.env.PORT || 3000;


app.use("/", baseRoutes);
app.use("/api", apiRoutes);


app.listen(port);