
mapboxgl.accessToken = 'pk.eyJ1Ijoic2hheWFudHNpdGFsIiwiYSI6ImNrNzg2OW9pOTA3OWwzbW00czF1dDg3MDkifQ.LUxQ3G2112rdWgMP8AitIg';
var map = new mapboxgl.Map({
    container: 'map',
    zoom: 1,
    style: 'mapbox://styles/mapbox/dark-v10',
});

map.on('load', function () {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('earthquakes', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: `${window.location.href}confirmed`,
        cluster: true,
        clusterMaxZoom: 10, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                30,
                '#f1f075',
                40,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                30,
                30,
                40,
                40
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('earthquakes').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {

        let object = e.features[0].properties

        var coordinates = e.features[0].geometry.coordinates.slice();
        let place = object.name
        let cases = object.confirmed



        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`${place} has <strong>${cases}</strong> confirmed case(s)`)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
});


const goToLocationOnMap = (long, lat) => {
    map.flyTo({
        center: [
            long,
            lat
        ],
        zoom: 5,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
}

const setListItemActiveState = (listArray, currentListItem) => {
    listArray.forEach(listItem => {
        if (listItem !== currentListItem) {
            listItem.classList.remove("active");
        } else {
            listItem.classList.add("active");
        }
    });
}



const getCountryCooridinates = (element) => {
    const long = parseInt(element.dataset.long)
    const lat = parseInt(element.dataset.lat)

    countryList = document.querySelectorAll('.countryListItems');

    setListItemActiveState(countryList, element)

    goToLocationOnMap(long, lat)


}
function getDates() {
    let date = new Date();

    const dateArray = [];
    let startDate = '2020-01-22';
    let month = (date.getMonth() + 1 < 10) ? "0" + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
    let day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
    let year = date.getFullYear();
    let dateMove = new Date(startDate)
    let endDate = `${year}-${month}-${day}`;
    var strDate = startDate;

    while (strDate < endDate) {

        var strDate = dateMove.toISOString().slice(0, 10);
        dateArray.push(strDate);
        dateMove.setDate(dateMove.getDate() + 1);
    };
    return dateArray;
}



const showChart = () => {
    const graph = document.getElementById("graphCollapse")

    if (graph.classList.contains("show")) {
        Promise.all([
            fetch(`${window.location.href}api/confirmed`).then(value => value.json()),
            fetch(`${window.location.href}api/deaths`).then(value => value.json()),
            fetch(`${window.location.href}api/recoveries`).then(value => value.json())
        ])
            .then((value) => {
                confirmedArray = value[0]
                deathsArray = value[1];
                recoveriesArray = value[2];

                activeListItem = document.querySelector(".active");
                name = (activeListItem.dataset.province === "") ? activeListItem.dataset.country : activeListItem.dataset.province
                conFirmedValues = [];
                deathValues = [];
                recoveriesValues = [];
                confirmedArray.forEach(timeline => {
                    if (timeline.name === name) {
                        conFirmedValues = timeline.values
                        return;
                    }
                })

                deathsArray.forEach(timeline => {
                    if (timeline.name === name) {
                        deathValues = timeline.values
                        return;
                    }
                })
                recoveriesArray.forEach(timeline => {
                    if (timeline.name === name) {
                        recoveriesValues = timeline.values
                        return;
                    }
                })

                var ctx = document.getElementById('myChart').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: getDates(),
                        datasets: [{
                            label: '# of Cases',
                            data: conFirmedValues,
                            borderColor: 'rgb(255, 193, 7)'
                        }, {
                            label: '# of Deaths',
                            data: deathValues,
                            borderColor: 'rgb(220, 53, 69)'
                        }, {
                            label: '# of Recoveries',
                            data: recoveriesValues,
                            borderColor: 'rgb(40, 167, 69)'
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }




}



const searchList = () => {
    const searchInput = document.getElementById('countrySearch')
    const search = searchInput.value.charAt(0).toUpperCase() + searchInput.value.slice(1);

    const countryListItems = document.querySelectorAll(".countryListItems")


    countryListItems.forEach(listItem => {
        if (search.length > 0) {
            if (!listItem.dataset.province.includes(search) && !listItem.childNodes[1].innerHTML.includes(search)) {
                listItem.style.display = "none"
            } else {
                listItem.style.display = "block"
            }
        } else {
            listItem.style.display = "block"
        }
    })

}