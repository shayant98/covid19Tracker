const csvtojson = require("csvtojson");
const request = require("request");
const geojson = require("geojson");
const cheerio = require("cheerio");
const cloudscraper = require("cloudscraper");
const tabletojson = require("tabletojson").Tabletojson;
const dotenv = require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

const worldMeterParser = require("../utils/worldMeterParser");

exports.getCurrentStatus = async (req, res, next) => {
  fs.readFile("data/countryData.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
};

exports.caseByCountry = async (req, res, next) => {
  try {
    const rawData = await fs.readFileSync("data/detail.json");
    const countryData = JSON.parse(rawData);

    const countryFound = countryData.filter((country) => {
      return country.name.trim() === req.params.country.trim();
    })[0];
    let data = [];
    const country = [];
    if (countryFound) {
      switch (countryFound.name) {
        case "usa":
          data = await caseByCountryWorldMeterUS(countryFound);
          break;

        default:
          data = await caseByCountryWorldMeter(countryFound);

          break;
      }
    } else {
      country["name"] = req.params.country;
      country[
        "url"
      ] = `${process.env.WORLDOMETER_URL}/country/${req.params.country}`;
      data = await caseByCountryWorldMeter(country);
    }
    const countryInfo = await axios.get(
      `${process.env.COUNTRIES_API}/${
        countryFound === undefined ? country.name : countryFound.alt_name
      }?fullText=true`
    );
    data["CountryInfo"] = countryInfo.data[0];
    res.json(data);
  } catch (e) {
    res.status(404).json({ message: e });
  }
};

const caseByCountryWorldMeter = async (country) => {
  const url = await cloudscraper(`${country.url}`);
  const $ = cheerio.load(url);

  return worldMeterParser.parseWorldMeterData($);
};
const caseByCountryWorldMeterUS = async (country) => {
  const url = await cloudscraper(`${country.url}`);
  const $ = cheerio.load(url);

  const html = $.html();
  const data = worldMeterParser.parseWorldMeterData($);

  const casesByState = tabletojson.convert(html, {
    stripHtmlFromHeadings: false,
    ignoreHiddenRows: true,
    ignoreColumns: [0, 6, 7, 9, 10, 12, 13, 14],
    headings: [
      "state",
      "totalCases",
      "newCases",
      "totalDeaths",
      "newDeaths",
      "activeCases",
      "totalTest",
    ],
  })[0];
  casesByState.shift();
  data["caseByState"] = casesByState;

  return data;
};

exports.confirmedCasesGeo = async (req, res, next) => {
  const confirmedHistory = await csvtojson({
    trim: true,
  }).fromStream(request.get(process.env.JHU_CONFIRMED_URL));

  const confirmedHistoryJsonArray = [];

  confirmedHistory.forEach((country) => {
    GeoJsonObject = {
      name:
        country["Province/State"] === ""
          ? country["Country/Region"]
          : country["Province/State"],
      category: "case",
      lat: country.Lat,
      long: country.Long,
      confirmed: parseInt(
        country[Object.keys(country)[Object.keys(country).length - 1]]
      ),
    };

    confirmedHistoryJsonArray.push(GeoJsonObject);
  });

  const geoJsonArray = geojson.parse(confirmedHistoryJsonArray, {
    Point: ["lat", "long"],
  });
  res.status(200).json(geoJsonArray);
};

exports.vaccines = async (req, res, next) => {
  const vaccineData = await csvtojson({
    trim: true,
  }).fromStream(request.get(process.env.VACCINE_COUNTRY_URL));

  res.json(vaccineData);
};

exports.vaccineByCountry = async (req, res, next) => {
  const country =
    req.params.country.charAt(0).toUpperCase() + req.params.country.slice(1); //cap first letter eg. "denmark" - "Denmark"
  const vaccineData = await csvtojson({
    trim: true,
  }).fromStream(
    request.get(
      `https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/${country}.csv`
    )
  );

  res.json(vaccineData.reverse());
};
