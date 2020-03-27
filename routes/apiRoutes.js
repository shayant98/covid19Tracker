const Router = require('express').Router();

const ApiController = require("../controllers/apiController");

Router.get("/confirmed", ApiController.confirmedTimeline);
Router.get("/deaths", ApiController.deathTimeline);
Router.get("/recoveries", ApiController.recoveriesTimeline);
Router.get("/geo/cases", ApiController.confirmedCasesGeo);
Router.get("/currentstatus", ApiController.currentStatus);
Router.get("/cases/:country", ApiController.caseByCountry);





module.exports = Router;
