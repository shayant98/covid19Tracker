const Router = require('express').Router();

const BaseController = require("../controllers/BaseController")




Router.get("/", BaseController.homeScreen)



module.exports = Router
