const fs = require("fs");

const homeScreen = async (req, res, next) => {
  res.render("home");
};

const faqScreen = async (req, res, next) => {
  try {
    let rawData = await fs.readFileSync("data/faq.json");
    faqData = JSON.parse(rawData);
  } catch (error) {
    console.log(error);
  }

  res.render("faq", {
    name: "COVID-19 Tracker",
    faqData,
  });
};

const sourcesScreen = async (req, res, next) => {
  res.render("sources");
};
const mapScreen = async (req, res, next) => {
  res.render("map");
};

const vaccineScreen = async (req, res, next) => {
  res.render("vaccine");
};

module.exports = {
  homeScreen,
  sourcesScreen,
  faqScreen,
  mapScreen,
  vaccineScreen,
};
