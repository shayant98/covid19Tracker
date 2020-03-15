const Router = require('express').Router();

const BaseController = require("../controllers/BaseController")




Router.get("/", BaseController.homeScreen)
Router.get("/faq", BaseController.faqScreen)



module.exports = Router
