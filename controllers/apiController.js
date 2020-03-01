const csvtojson = require("csvtojson");
const request = require("request");


const confirmedFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
const deathsFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
const recoveriesFile = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";


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

const createTimelineObject = data => {
    const dates = Object.keys(data).map(key => data[key].trim());
    dates.splice(0, 4);

    timelineObject = {
        name: (data["Province/State"] === "") ? data["Country/Region"] : data["Province/State"],
        values: dates

    }
    timeline.push(timelineObject)

}