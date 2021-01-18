# 🦠 Coronavirus Tracker
a covid nCovid-19 (Coronavirus) pandemic tracker app

# Motivation
This app was built to consolidate keep track of the Covid-19 infection numbers in an easy to follow interface.

# Technologies Used

### Frontend
 <img alt="JavaScript" src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/><img alt="Bootstrap" src="https://img.shields.io/badge/bootstrap%20-%23563D7C.svg?&style=for-the-badge&logo=bootstrap&logoColor=white"/>

### Backend
<img src="https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/><img src="https://img.shields.io/badge/express.js%20-%23404d59.svg?&style=for-the-badge"/>

### Hosting
<img alt="Heroku" src="https://img.shields.io/badge/heroku%20-%23430098.svg?&style=for-the-badge&logo=heroku&logoColor=white"/>

## Features

 - Global COVID Status
 - Covid Data by country
 - Favorite countries on multiple visits
 - Search by country/province or Region
 - Covid Data by state (US Only)
 - Covid Data on Map
 - FAQ
 - Vaccine Data By Country

## API Reference
The API consist of 4 basic **GET** endpoints

 -  [Current Global Status](https://covid19trackershayant.herokuapp.com/api/currentstatus)
 -  [Cases By Country](https://covid19trackershayant.herokuapp.com/api/cases/suriname)
 -  [Countries with Vaccine Data](https://covid19trackershayant.herokuapp.com/api/vaccines)
 -  [Vaccine Log of a Country](https://covid19trackershayant.herokuapp.com/api/vaccines/denmark)

## Installation
1. Install nodeJS https://nodejs.org
2. Clone the repo `git clone https://github.com/shayant98/covid19Tracker.git`
3. run `npm install`
4. add necessary variables to ENV
5. run `npm run dev` to startup a local DEV server



### usage
To use the app visit [this link](covid19trackershayant.herokuapp.com/)
## Credits
A Special thanks to the follow, without whom this project would not be possible:
 - [Worldmeter](https://www.worldometers.info/coronavirus/)
 - [Our World In Data](https://github.com/owid/covid-19-data/tree/master/public/data)
 - [John Hopkins University](https://github.com/CSSEGISandData/COVID-19)
 - [REST Countries](https://restcountries.eu/) -- for flags

## Licencse
MIT © [shayant98](https://github.com/shayant98)
