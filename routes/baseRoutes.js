const Router = require('express').Router();
const cache = require("../utils/cache")
const BaseController = require("../controllers/BaseController")




Router.get("/", cache(100), BaseController.homeScreen)
Router.get("/faq", BaseController.faqScreen)
Router.get("/sources", BaseController.sourcesScreen)




module.exports = Router
