const Router = require('express').Router();

const ApiController = require("../controllers/apiController")

Router.get("/confirmed", ApiController.confirmedTimeline)
Router.get("/deaths", ApiController.deathTimeline)
Router.get("/recoveries", ApiController.recoveriesTimeline)




module.exports = Router
