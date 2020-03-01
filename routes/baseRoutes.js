const Router = require('express').Router();

const BaseController = require("../controllers/BaseController")




Router.get("/", BaseController.homeScreen)
Router.get("/confirmed", BaseController.confirmed)


module.exports = Router
