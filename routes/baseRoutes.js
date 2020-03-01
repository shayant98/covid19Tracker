const Router = require('express').Router();

const BaseController = require("../controllers/BaseController")




Router.get("/", BaseController.homeScreen)
Router.get("/confirmed", BaseController.confirmed)
Router.get("/api/confirmed", BaseController.confirmedHistoryPath)
Router.get("/api/deaths", BaseController.confirmedDeathPath)
Router.get("/api/recoveries", BaseController.confirmedRecoveriesPath)




module.exports = Router
