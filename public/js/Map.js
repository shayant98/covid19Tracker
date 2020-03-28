export default class map {
    constructor(container, zoom, style) {
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2hheWFudHNpdGFsIiwiYSI6ImNrNzg2OW9pOTA3OWwzbW00czF1dDg3MDkifQ.LUxQ3G2112rdWgMP8AitIg';
        this.mapbox = new mapboxgl.Map({
            container: container,
            zoom: zoom,
            style: style,
        });

    }


    init() {

        this.mapbox.on('load', function () {
            // Add a new source from our GeoJSON data and
            // set the 'cluster' option to true. GL-JS will
            // add the point_count property to your source data.
            this.addSource('cases', {
                type: 'geojson',
                // Point to GeoJSON data. This example visualizes all M1.0+ cases
                // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                data: `${window.location.href}api/geo/cases`,
                cluster: true,
                clusterMaxZoom: 10, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });

            this.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'cases',
                filter: ['has', 'point_count'],
                paint: {

                    'circle-color': "#ffc107",
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

            this.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'cases',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });

            this.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'cases',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#ffc107',
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000'
                }
            });

            // inspect a cluster on click
            this.on('click', 'clusters', (e) => {
                const features = this.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });
                const clusterId = features[0].properties.cluster_id;
                this.getSource('cases').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;

                        this.easeTo({
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
            this.on('click', 'unclustered-point', (e) => {

                const object = e.features[0].properties

                const coordinates = e.features[0].geometry.coordinates.slice();
                const place = object.name;
                const cases = object.confirmed;


                // Ensure that if the map is zoomed out such that
                // multiple copies of the feature are visible, the
                // popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(`${place} has <strong>${cases}</strong> confirmed case(s)`)
                    .addTo(this);
            });

            this.on('mouseenter', 'clusters', () => {
                this.getCanvas().style.cursor = 'pointer';
            });
            this.on('mouseleave', 'clusters', () => {
                this.getCanvas().style.cursor = '';
            });
        });
    }

    showLocation(long, lat) {
        this.mapbox.flyTo({
            center: [
                long,
                lat
            ],
            zoom: 5,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }
}
