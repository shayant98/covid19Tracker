const Router = require('express').Router();
const cache = require("../utils/cache")

const ApiController = require("../controllers/apiController");


Router.get("/geo/cases", cache(100), ApiController.confirmedCasesGeo);
Router.get("/currentstatus", cache(100), ApiController.getCurrentStatus);
Router.get("/cases/:country", cache(100), ApiController.caseByCountry);





module.exports = Router;
