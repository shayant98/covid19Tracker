const csvtojson = require("csvtojson");
const request = require("request");
const geojson = require("geojson");
const cheerio  =require("cheerio");
const cloudscraper  =require("cloudscraper");
const tabletojson = require('tabletojson').Tabletojson;


const confirmedFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
const deathsFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
const recoveriesFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";



exports.getCurrentStatus = async (req,res,next) => {
    const url = await cloudscraper(`https://www.worldometers.info/coronavirus`);
    const $ = cheerio.load(url);
    const html = $.html();


    const totalCases = $(".maincounter-number span:first-child").eq(0).text().trim();
    const totalDeaths = $(".maincounter-number span:first-child").eq(1).text().trim();
    const totalRecoveries = $(".maincounter-number span:first-child").eq(2).text().trim();

    const totalActive = $(".panel_front div:first-child").eq(0).text();
    const totalActiveMild = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(0).text().trim();
    const totalActiveSevere = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(0).text().trim();

    const totalClosed = $(".panel_front .number-table-main").eq(1).text().trim();
    const totalClosedRecoveries = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(1).text().trim();
    const totalClosedDeaths = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(1).text().trim();

    const casesByCountry = tabletojson.convert(html, {
        stripHtmlFromHeadings:true,
        headings: ['name', 'totalCases','newCases', 'totalDeaths','newDeaths','totalRecoveries','activeCases','seriousCases','totCasesPer1Mil','totDeathsPer1Mil',]
    })[0];

    return {
        totalCases,
        totalDeaths,
        totalRecoveries,
        "activeCases": {
            totalActive,
            totalActiveMild,
            totalActiveSevere
        },
        "closedCases": {
            totalClosed,
            totalClosedRecoveries,
            totalClosedDeaths
        },
        casesByCountry
    };

};

exports.currentStatus = async (req, res, next) => {

    try {
        const data = await this.getCurrentStatus();

        res.json(data);
    }catch (e) {
        console.error(e)
    }
};



exports.caseByCountry = async (req, res, next) => {
    const url = await cloudscraper(`https://www.worldometers.info/coronavirus/country/${req.params.country}`);
    const $ = cheerio.load(url);
    const html = $.html();


    const totalCases = $(".maincounter-number span:first-child").eq(0).text().trim();
    const totalDeaths = $(".maincounter-number span:first-child").eq(1).text().trim();
    const totalRecoveries = $(".maincounter-number span:first-child").eq(2).text().trim();

    const totalActive = $(".panel_front div:first-child").eq(0).text();
    const totalActiveMild = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(0).text().trim();
    const totalActiveSevere = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(0).text().trim();

    const totalClosed = $(".panel_front .number-table-main").eq(1).text().trim();
    const totalClosedRecoveries = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(1).text().trim();
    const totalClosedDeaths = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(1).text().trim();

    const jsonObject = {
        totalCases,
        totalDeaths,
        totalRecoveries,
       "activeCases":{
           totalActive,
           totalActiveMild,
           totalActiveSevere
       },
        "closedCases":{
            totalClosed,
            totalClosedRecoveries,
            totalClosedDeaths
        }
    }
   res.json(jsonObject);
};

exports.confirmedTimeline = async (req, res, next) => {


    const confirmedTimeline = await csvtojson({
        trim: true,
    }).fromStream(request.get(confirmedFile));

    timeline = []

    confirmedTimeline.forEach(country => {
        createTimelineObject(country)
    })


    res.json(timeline)
}
exports.deathTimeline = async (req, res, next) => {


    const deathTimeline = await csvtojson({
        // headers: ['province', 'country', 'lastUpdate', 'confirmed', 'deaths', 'recovered'],
        trim: true,
        // noheader: true
        // includeColumns: Lat | Long
        // colParser: {
        //     "confirmed": "number",
        //     "deaths": "number",
        //     "recovered": "number",

        // },
        // checkType: true
    }).fromStream(request.get(deathsFile));

    timeline = []

    deathTimeline.forEach(country => {
        createTimelineObject(country)
    })


    res.json(timeline)
}
exports.recoveriesTimeline = async (req, res, next) => {


    const recoveriesTimeline = await csvtojson({
        // headers: ['province', 'country', 'lastUpdate', 'confirmed', 'deaths', 'recovered'],
        trim: true,
        // noheader: true
        // includeColumns: Lat | Long
        // colParser: {
        //     "confirmed": "number",
        //     "deaths": "number",
        //     "recovered": "number",

        // },
        // checkType: true
    }).fromStream(request.get(recoveriesFile));

    timeline = []

    recoveriesTimeline.forEach(country => {
        createTimelineObject(country)
    })


    res.json(timeline)
}
exports.confirmedCasesGeo = async (req, res, next) => {


    const confirmedHistory = await csvtojson({
        trim: true,

    }).fromStream(request.get(confirmedFile));

    const confirmedHistoryJsonArray = []

    confirmedHistory.forEach(country => {
        GeoJsonObject = {
            name: (country["Province/State"] === "") ? country["Country/Region"] : country["Province/State"],
            category: 'case',
            lat: country.Lat,
            long: country.Long,
            confirmed: parseInt(country[Object.keys(country)[Object.keys(country).length - 1]])
        }

        confirmedHistoryJsonArray.push(GeoJsonObject);

    })


    let geojsonAray = geojson.parse(confirmedHistoryJsonArray, { Point: ['lat', 'long'] });
    res.status(200).json(geojsonAray)
}


const createTimelineObject = data => {
    const dates = Object.keys(data).map(key => data[key].trim());
    dates.splice(0, 4);

    timelineObject = {
        name: (data["Province/State"] === "") ? data["Country/Region"] : data["Province/State"],
        values: dates

    }
    timeline.push(timelineObject)

}




