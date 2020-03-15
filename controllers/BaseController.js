const csvtojson = require("csvtojson");
const request = require("request");
const moment = require("moment");
const fs = require("fs");
const path = require("path")




exports.homeScreen = async (req, res, next) => {

    const fileDate = moment().utc().subtract(1, 'days').format("MM-DD-YYYY")
    const filePath = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${fileDate}.csv`;

    const dailyRapport = await csvtojson({
        headers: ['province', 'country', 'lastUpdate', 'confirmed', 'deaths', 'recovered', 'lat', 'long'],
        trim: true,
        colParser: {
            "confirmed": "number",
            "deaths": "number",
            "recovered": "number",
            "lat": "number",
            "long": "number"


        },
        checkType: true
    }).fromStream(request.get(filePath));



    const totalDeaths = dailyRapport.reduce((total, country) => country.deaths + total, 0)
    const totalConfirmed = dailyRapport.reduce((total, country) => country.confirmed + total, 0)
    const totalRecovered = dailyRapport.reduce((total, country) => country.recovered + total, 0)




    res.render('home',
        {
            name: "COVID-19 Tracker",
            fileDate,
            totalConfirmed,
            totalDeaths,
            totalRecovered,
            data: dailyRapport
        }
    )




};


exports.faqScreen = async (req, res, next) => {
    console.log(__dirname);

    try {
        let rawData = await fs.readFileSync("data/faq.json")
        faqData = JSON.parse(rawData);
    } catch (error) {
        console.log(error);

    }

    res.render('faq',
        {
            name: "COVID-19 Tracker",
            faqData
        }
    )

}