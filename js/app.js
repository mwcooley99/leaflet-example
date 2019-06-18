function middle(num1, num2) {
    return (num1 + num2) / 2;
}

function getColor(d) {
    return d > 5  ? '#d53e4f' :
           d > 4  ? '#fc8d59' :
           d > 3  ? '#fee08b' :
           d > 2   ? '#e6f598' :
           d > 1   ? '#99d594' :
                     '#3288bd' ;
                      
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

function onEachFeature(feature, layer){
    let popUpContent = `<b>Location:</b> ${feature.properties.place}</br><b>Magnitude:</b> ${feature.properties.mag}`
    // TODO - add in some error checking here
    layer.bindPopup(popUpContent);
}

data_query = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-06-09&endtime=2019-06-16&latitude=37.7&longitude=-122.4&maxradius=10";

var mapZoomLevel = 6;
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
var mapboxUrl = `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?` +
                    `access_token=${API_KEY}`

function createMap(data) {
    var outdoors = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mbAttr});

    console.log(data);

    var map = L.map("map-id", {
        center: [37.7, -122.4],
        zoom: mapZoomLevel,
        layers: [outdoors]
    });
    
    
    
    var markers = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            
            var geojsonMarkerOptions = {
                radius: feature.properties.mag ** 2.2,
                fillColor: getColor(feature.properties.mag), 
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
    }).addTo(map);

    legend.addTo(map);

}

// function createMarkers(data){
//     let earthquakes = data.features;
//     let markers = earthquakes.map(d => {
//         let marker = L.marker([d.geometry.coordinates[1], d.geometry.coordinates[0]]);
//         marker.bindPopup(`${d.properties.place}</br>Magnitude: ${d.properties.mag}`);
//         return marker;
//     });
//     createMap(data, markers);

// }

// createMap();

d3.json(data_query, createMap)
// d3.json("data/earthquakes.json", createMap)
