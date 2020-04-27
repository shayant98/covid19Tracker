const csvtojson = require("csvtojson");
const request = require("request");
const geojson = require("geojson");
const cheerio = require("cheerio");
const cloudscraper = require("cloudscraper");
const tabletojson = require('tabletojson').Tabletojson;
const dotenv = require('dotenv').config();
const fs = require("fs");
const axios = require('axios');

const worldMeterParser = require("./worldMeterParser")


const saveDataToJson = () => {
    return async (req, res, next) => {

        const data = await scrapeData()

        fs.truncateSync('data/countryData.json')
        fs.writeFileSync('data/countryData.json', JSON.stringify(data))
        next()

    }
}

const scrapeData = async () => {
    const url = await cloudscraper(`${process.env.WORLDOMETER_URL}`);
    const $ = cheerio.load(url);
    const html = $.html();


    const data = worldMeterParser.parseWorldMeterData($);
    const casesByCountry = tabletojson.convert(html, {
        stripHtmlFromHeadings: false,
        headings: ['name', 'totalCases', 'newCases', 'totalDeaths', 'newDeaths', 'totalRecoveries', 'activeCases', 'seriousCases', 'totCasesPer1Mil', 'totDeathsPer1Mil', 'totalTests', 'totalTestsPer1Mil', 'region']
    })[0];


    data['casesByCountry'] = casesByCountry
    return data
}



module.exports = saveDataToJson
