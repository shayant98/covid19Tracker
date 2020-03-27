const Router = require('express').Router();

const ApiController = require("../controllers/apiController");


Router.get("/geo/cases", ApiController.confirmedCasesGeo);
Router.get("/currentstatus", ApiController.getCurrentStatus);
Router.get("/cases/:country", ApiController.caseByCountry);





module.exports = Router;
