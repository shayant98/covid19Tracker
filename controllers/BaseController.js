const csvtojson = require("csvtojson");
const request = require("request");
const moment = require("moment");
const fs = require("fs");
const path = require("path")
const apiController  = require("./apiController");



exports.homeScreen = async (req, res, next) => {
    res.render('home')
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