const cheerio = require("cheerio");
const cloudscraper = require("cloudscraper");
const tabletojson = require("tabletojson").Tabletojson;
const dotenv = require("dotenv").config();
const fs = require("fs");

const worldMeterParser = require("./worldMeterParser");

const saveDataToJson = () => {
  return async (req, res, next) => {
    const data = await scrapeData();

    fs.truncateSync("data/countryData.json");
    fs.writeFileSync("data/countryData.json", JSON.stringify(data));
    next();
  };
};

const scrapeData = async () => {
  const url = await cloudscraper(`${process.env.WORLDOMETER_URL}`);
  const $ = cheerio.load(url);
  const html = $.html();

  const data = worldMeterParser.parseWorldMeterData($);
  const casesByCountry = tabletojson.convert(html, {
    stripHtmlFromHeadings: true,
    ignoreColumns: [0, 16, 17, 18],
    headings: [
      "name",
      "totalCases",
      "newCases",
      "totalDeaths",
      "newDeaths",
      "totalRecoveries",
      "newRecoveries",
      "activeCases",
      "seriousCases",
      "totCasesPer1Mil",
      "totDeathsPer1Mil",
      "totalTests",
      "totalTestsPer1Mil",
      "population",
      "region",
    ],
  })[0];

  data["casesByCountry"] = casesByCountry;
  return data;
};

module.exports = saveDataToJson;
