const path = require("path")
const csvtojson = require("csvtojson");
const request = require("request");
const moment = require("moment");
const geojson = require("geojson")



exports.homeScreen = async (req, res, next) => {


    const fileDate = moment().subtract(1, 'days').format("MM-DD-YYYY")




    const dailyRapport = await csvtojson({
        headers: ['province', 'country', 'lastUpdate', 'confirmed', 'deaths', 'recovered'],
        trim: true,
        colParser: {
            "confirmed": "number",
            "deaths": "number",
            "recovered": "number",

        },
        checkType: true
    }).fromStream(request.get(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${fileDate}.csv`));

    const confirmedHistory = await csvtojson({
        // headers: ['province', 'country', 'lastUpdate', 'confirmed', 'deaths', 'recovered'],
        trim: true,
        noheader: true
        // includeColumns: Lat | Long
        // colParser: {
        //     "confirmed": "number",
        //     "deaths": "number",
        //     "recovered": "number",

        // },
        // checkType: true
    }).fromStream(request.get(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv`));

    const confirmedHistoryJsonArray = []

    confirmedHistory.forEach(country => {
        if (country.field1 === "") {
            nameValue = country.field2
        } else {
            nameValue = country.field1
        }
        GeoJsonObject = {
            name: nameValue,
            category: 'confirmed',
            lat: country.field3,
            long: country.field4
        }

        confirmedHistoryJsonArray.push(GeoJsonObject);

    })

    const geojsonAray = geojson.parse(confirmedHistoryJsonArray, { Point: ['lat', 'lng'] });
    console.log(geojsonAray);


    const totalDeaths = dailyRapport.reduce((total, country) => country.deaths + total, 0)
    const totalConfirmed = dailyRapport.reduce((total, country) => country.confirmed + total, 0)
    const totalRecovered = dailyRapport.reduce((total, country) => country.recovered + total, 0)




    res.render('home', { name: "COVID-19 Tracker", fileDate, totalConfirmed, totalDeaths, totalRecovered, data: dailyRapport, geojsonAray })




}

exports.confirmed = async (req, res, next) => {


    const confirmedHistory = await csvtojson({
        // headers: ['province', 'country', 'lastUpdate', 'confirmed', 'deaths', 'recovered'],
        trim: true,
        noheader: true
        // includeColumns: Lat | Long
        // colParser: {
        //     "confirmed": "number",
        //     "deaths": "number",
        //     "recovered": "number",

        // },
        // checkType: true
    }).fromStream(request.get(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv`));

    const confirmedHistoryJsonArray = []

    confirmedHistory.forEach(country => {
        if (country.field1 === "") {
            nameValue = country.field2
        } else {
            nameValue = country.field1
        }
        GeoJsonObject = {
            name: nameValue,
            category: 'confirmed',
            lat: country.field3,
            long: country.field4,
            confirmed: parseInt(country[Object.keys(country)[Object.keys(country).length - 1]])
        }

        confirmedHistoryJsonArray.push(GeoJsonObject);
        console.log(Object.keys(country)[Object.keys(country).length - 1]);

    })

    confirmedHistoryJsonArray.shift()

    let geojsonAray = geojson.parse(confirmedHistoryJsonArray, { Point: ['lat', 'long'] });
    console.log(geojsonAray);


    res.json(geojsonAray)




}