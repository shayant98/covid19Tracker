import Map from "./MapBox.js";

const Mapbox = new Map('map', 2, 'mapbox://styles/mapbox/dark-v10')
Mapbox.init();


const goToLocationOnMap = (long, lat) => {
    Mapbox.showLocation(long, lat)
};
