export default class map {
  constructor(container, zoom, style, key) {
    mapboxgl.accessToken = key;

    this.mapbox = new mapboxgl.Map({
      container: container,
      zoom: zoom,
      style: style,
    });
  }

  init() {
    const nav = new mapboxgl.NavigationControl();
    this.mapbox.addControl(
      new mapboxgl.GeolocateControl(
        {
          fitBoundsOptions: { maxZoom: 5 },
        },
        "top-left"
      )
    );
    this.mapbox.addControl(nav, "bottom-right");
    this.mapbox.addControl(
      new MapboxGeocoder(
        {
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
        },
        "top-left"
      )
    );
  }
  showLocation(long, lat) {
    this.mapbox.flyTo({
      center: [long, lat],
      zoom: 5,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }

  drawData(data) {
    console.log(this.mapbox.loaded());
    if (this.mapbox.loaded()) {
      this.mapbox.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: data.features,
        },
      });
      this.mapbox.addLayer({
        id: "circles",
        source: "points",
        type: "circle",
        paint: {
          "circle-opacity": 0.75,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "confirmed"],
            1,
            4,
            1000,
            8,
            4000,
            10,
            8000,
            14,
            12000,
            18,
            100000,
            40,
            250000,
            100,
          ],
          "circle-color": "#ffc107",
        },
      });
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      this.mapbox.on("mousemove", "circles", (e) => {
        const object = e.features[0].properties;
        let confirmed;
        const place = object.name;
        const listItem = document.querySelector(`[data-id*='${place}']`);
        if (listItem !== null) {
          let badgeContainer;
          if (listItem.childNodes.length > 2) {
            badgeContainer = listItem.childNodes[2].childNodes;
          } else {
            badgeContainer = listItem.childNodes[1].childNodes;
          }
          for (let index = 0; index < badgeContainer.length; index++) {
            const element = badgeContainer[index];
            if (element.classList.contains("badge-warning")) {
              confirmed = element.innerText;
            }
          }
        } else {
          confirmed = object.confirmed;
        }
        this.mapbox.getCanvas().style.cursor = "pointer";
        const coordinates = e.features[0].geometry.coordinates.slice();
        const HTML = `<span style='color:#000'>${place} has <strong>${confirmed}</strong> confirmed case(s)</span>`;
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        popup.setLngLat(coordinates).setHTML(HTML).addTo(this.mapbox);
      });
      this.mapbox.on("mouseleave", "circles", function () {
        this.getCanvas().style.cursor = "";
        popup.remove();
      });
    } else {
      this.drawData(data);
    }
  }
}
