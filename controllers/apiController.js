const csvtojson = require("csvtojson");
const request = require("request");
const geojson = require("geojson");
const cheerio  =require("cheerio");
const cloudscraper  =require("cloudscraper");
const tabletojson = require('tabletojson').Tabletojson;
const dotenv = require('dotenv').config();
const fs = require("fs");



const confirmedFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
const deathsFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
const recoveriesFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";



exports.getCurrentStatus = async (req,res,next) => {
    const url = await cloudscraper(`${process.env.WORLDOMETER_URL}`);
    const $ = cheerio.load(url);
    const html = $.html();


    const totalCases = $(".maincounter-number span:first-child").eq(0).text().trim();
    const totalDeaths = $(".maincounter-number span:first-child").eq(1).text().trim();
    const totalRecoveries = $(".maincounter-number span:first-child").eq(2).text().trim();

    const totalActive = $(".panel_front div:first-child").eq(0).text();
    const totalActiveMild = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(0).text().trim();
    const totalActiveMildPerc = $(".panel_front div:nth-child(3) div:nth-child(1) strong").eq(0).text().trim();
    const totalActiveSevere = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(0).text().trim();
    const totalActiveSeverePerc = $(".panel_front div:nth-child(3) div:nth-child(2) strong").eq(0).text().trim();

    const totalClosed = $(".panel_front .number-table-main").eq(1).text().trim();
    const totalClosedRecoveries = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(1).text().trim();
    const totalClosedRecoveriesPerc = $(".panel_front div:nth-child(3) div:nth-child(1) strong").eq(1).text().trim();
    const totalClosedDeaths = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(1).text().trim();
    const totalClosedDeathsPerc = $(".panel_front div:nth-child(3) div:nth-child(2) strong").eq(1).text().trim();

    const casesByCountry = tabletojson.convert(html, {
        stripHtmlFromHeadings:false,
        headings: ['name', 'totalCases','newCases', 'totalDeaths','newDeaths','totalRecoveries','activeCases','seriousCases','totCasesPer1Mil','totDeathsPer1Mil',]
    })[0];

    res.json( {
        totalCases,
        totalDeaths,
        totalRecoveries,
        "activeCases": {
            totalActive,
            totalActiveMild,
            totalActiveSevere,
            totalActiveSeverePerc,
            totalActiveMildPerc,
            totalClosedRecoveriesPerc,
            totalClosedDeathsPerc
        },
        "closedCases": {
            totalClosed,
            totalClosedRecoveries,
            totalClosedDeaths
        },
        casesByCountry
    });

};

exports.caseByCountry = async (req,res,next) => {
   try {
       const rawData = await fs.readFileSync("data/detail.json");
       const countryData = JSON.parse(rawData);


       const countryFound = countryData.filter(country => {
           return country.name === req.params.country
       })[0];
       let data = [];
       if (countryFound){
           switch (countryFound.name) {
               case "suriname":
                  data = await getSurinameInfo(countryFound);
                   break;
               default:
                   data = await caseByCountryWorldMeter(countryFound);
           }
       }else{
           throw new Error("not found");
       }
        data['image'] = countryFound.img;
       res.json(data);

   }catch (e) {
       console.error(e)
   }
}


const caseByCountryWorldMeter = async (country) => {
    const url = await cloudscraper(`${country.url}`);
    const $ = cheerio.load(url);


    const totalCases = $(".maincounter-number span:first-child").eq(0).text().trim();
    const totalDeaths = $(".maincounter-number span:first-child").eq(1).text().trim();
    const totalRecoveries = $(".maincounter-number span:first-child").eq(2).text().trim();

    const totalActive = $(".panel_front div:first-child").eq(0).text();
    const totalActiveMild = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(0).text().trim();
    const totalActiveSevere = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(0).text().trim();

    const totalClosed = $(".panel_front .number-table-main").eq(1).text().trim();
    const totalClosedRecoveries = $(".panel_front div:nth-child(3) div:nth-child(1) .number-table").eq(1).text().trim();
    const totalClosedDeaths = $(".panel_front div:nth-child(3) div:nth-child(2) .number-table").eq(1).text().trim();


    const countryName = $(".content-inner div").eq(2).text().trim();
    const countryImage = `https://www.worldometers.info${$("h1 div img").attr('src')}`;


    return  {
        countryName,
        countryImage,
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

const getSurinameInfo = async country => {
    const url = await cloudscraper(`${country.url}`);
    const $ = cheerio.load(url);

    const quarentineLocationOverheid =  $("#counter_33802536285e7d75eb060ea").attr("data-counter-value");
    const quarentineLocationThuis =  $("#counter_23695291915e7d75eb063c1").attr("data-counter-value");
    const totalRecoveries =  $("#counter_2986213115e7d75eb06662").attr("data-counter-value");
    const totalDeaths =  $("#counter_37752750265e7d75eb0690d").attr("data-counter-value");
    const totalCases =  $("#counter_5075940075e7d75eb05b0f").attr("data-counter-value");


    return {
        countryName: "Suriname",
        quarentineLocationOverheid,
        quarentineLocationThuis,
        totalRecoveries,
        totalDeaths,
        totalCases
    }
}




