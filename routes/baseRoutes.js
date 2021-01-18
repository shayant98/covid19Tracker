const Router = require("express").Router();
const cache = require("../utils/cache");
const {
  faqScreen,
  homeScreen,
  mapScreen,
  sourcesScreen,
  vaccineScreen,
} = require("../controllers/BaseController");

Router.get("/", cache(10), homeScreen);
Router.get("/faq", faqScreen);
Router.get("/sources", sourcesScreen);
Router.get("/map", mapScreen);
Router.get("/vaccine", vaccineScreen);

module.exports = Router;
