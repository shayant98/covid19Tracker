const csvtojson = require("csvtojson");
const request = require("request");
const geojson = require("geojson");
const cheerio = require("cheerio");
const cloudscraper = require("cloudscraper");
const tabletojson = require('tabletojson').Tabletojson;
const dotenv = require('dotenv').config();
const fs = require("fs");
const axios = require('axios');

const worldMeterParser = require("../utils/worldMeterParser")

exports.getCurrentStatus = async (req, res, next) => {
    const url = await cloudscraper(`${process.env.WORLDOMETER_URL}`);
    const $ = cheerio.load(url);
    const html = $.html();

    const data = worldMeterParser.parseWorldMeterData($);
    const casesByCountry = tabletojson.convert(html, {
        stripHtmlFromHeadings: false,
        headings: ['name', 'totalCases', 'newCases', 'totalDeaths', 'newDeaths', 'totalRecoveries', 'activeCases', 'seriousCases', 'totCasesPer1Mil', 'totDeathsPer1Mil', 'totalTests', 'totalTestsPer1Mil', 'region']
    })[0];


    data['casesByCountry'] = casesByCountry
    res.json(data);

};

exports.caseByCountry = async (req, res, next) => {
    try {
        const rawData = await fs.readFileSync("data/detail.json");
        const countryData = JSON.parse(rawData);

        const countryFound = countryData.filter(country => {
            return country.name === req.params.country
        })[0];


        let data = [];
        const country = [];


        if (countryFound) {
            switch (countryFound.name) {
                case 'usa':
                    data = await caseByCountryWorldMeterUS(countryFound)
                    break;

                default:
                    data = await caseByCountryWorldMeter(countryFound);

                    break;
            }
        } else {

            country['name'] = req.params.country;
            country['url'] = `${process.env.WORLDOMETER_URL}/country/${req.params.country}`;
            data = await caseByCountryWorldMeter(country);
        }
        const countryInfo = await axios.get(`${process.env.COUNTRIES_API}/${(countryFound === undefined) ? country.name : countryFound.alt_name}`);
        data["CountryInfo"] = countryInfo.data[0]
        res.json(data);

    } catch (e) {

        res.status(404).json({ "message": e })
    }
}


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
        ignoreColumns: [6, 7, 9, 10],
        headings: ['state', 'totalCases', 'newCases', 'totalDeaths', 'newDeaths', 'activeCases', 'totalTest']
    })[0];
    casesByState.shift()
    data['caseByState'] = casesByState


    return data;

};

exports.confirmedCasesGeo = async (req, res, next) => {


    const confirmedHistory = await csvtojson({
        trim: true,
    }).fromStream(request.get(process.env.JHU_CONFIRMED_URL));

    const confirmedHistoryJsonArray = [];

    confirmedHistory.forEach(country => {
        GeoJsonObject = {
            name: (country["Province/State"] === "") ? country["Country/Region"] : country["Province/State"],
            category: 'case',
            lat: country.Lat,
            long: country.Long,
            confirmed: parseInt(country[Object.keys(country)[Object.keys(country).length - 1]])
        };

        confirmedHistoryJsonArray.push(GeoJsonObject);

    })


    const geoJsonArray = geojson.parse(confirmedHistoryJsonArray, { Point: ['lat', 'long'] });
    res.status(200).json(geoJsonArray)
}
