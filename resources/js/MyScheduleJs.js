
function chgimg(src, alt) {
    var image = document.getElementById("image");
    image.src = src;
    image.alt = alt;
}

function fadeImage() {
    var text = document.getElementById("button");
    var img = document.getElementById("image");
    var vis;
    var fade;

    if (text.innerHTML == "Go away!") {
        text.innerHTML = "Come back!";
        vis = 1;
        fade = setInterval(function () {
            if (vis <= 0) {
                fade = clearInterval(fade);
            }
            vis -= 0.1;
            img.style.opacity = vis;
        }, 20);
    }
    else {
        text.innerHTML = "Go away!";
        vis = 0;
        fade = setInterval(function () {
            if (vis >= 1) {
                fade = clearInterval(fade);
            }
            vis += 0.1;
            img.style.opacity = vis;
        }, 20);
    }


}



let map;
var marker2;
var infowindow2;
var i;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 44.9727, lng: -93.23540000000003 },
        zoom: 14,
    });
    var locations = document.getElementsByClassName("location");
    var times = document.getElementsByClassName("time");
    var events = document.getElementsByClassName("event");
    var days = document.getElementsByClassName("day");
    var locationList = [];
    var geocoderList = [];
    var eventList = [];
    var timeList = [];
    var dayList = [];
    for (i = 0; i < locations.length; i++) {
        var locationInfo = locations[i].innerText;
        locationList.push(locationInfo);
        var eventInfo = events[i].innerText;
        eventList.push(eventInfo);
        var timeInfo = times[i].innerText;
        timeList.push(timeInfo);
        var dayInfo = days[i].innerText;
        dayList.push(dayInfo);
        geocoderList[i] = new google.maps.Geocoder();
    }

    for (i = 0; i < locations.length; i++) {
        geocodeAddress(geocoderList[i], map, locationList[i], eventList[i], timeList[i], dayList[i]);
    }

}


function geocodeAddress(geocoder, resultsMap, address, event, time, day) {

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            const goldy = {
                url: "resources/images/Goldy.png",
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            marker2 = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                title: address,
                icon: goldy
            });
            infowindow2 = new google.maps.InfoWindow({
                content: event + " " + day + ": " + time + " " + address
            });
            markers.push(marker2);
            google.maps.event.addListener(marker2, 'click', createWindow(resultsMap, infowindow2, marker2));
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function createWindow(rmap, rinfowindow, rmarker) {
    return function () {
        rinfowindow.open(rmap, rmarker);
    }
}
window.initMap = initMap;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(search);
    } else {
        console.log("Failed to get user location");
    }
}

var service;
var infowindow;
var user;

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        title: place.name
    });
    markers.push(marker);

    infowindow2 = new google.maps.InfoWindow({
        content: place.name
    });

    google.maps.event.addListener(marker, 'click', createWindow(map, infowindow2, marker));

}


function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
}

function search(position) {
    deleteMarkers();
    user = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var radius = document.getElementById("radius");
    var type = document.getElementById("placeType");
    if (type.value == "other") {
        type = document.getElementById("other");
        var request = {
            location: user,
            radius: radius.value,
            name: [type.value]
        };
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }
    else {
        var request = {
            location: user,
            radius: radius.value,
            type: [type.value]
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function goto() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(calcRoute);
    } else {
        console.log("Failed to get user location");
    }
}

function calcRoute(position) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    user = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    const walk = document.getElementById("walk");
    const drive = document.getElementById("drive");
    const trans = document.getElementById("trans");
    var geocoder = new google.maps.Geocoder();
    var des = document.getElementById("to").value;
    geocoder.geocode({ 'address': des }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            des = results[0].geometry.location;
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
    var travelMode;
    if (walk.checked) {
        travelMode = "WALKING";
    }
    else if (trans.checked) {
        travelMode = "TRANSIT";
    }
    else {
        travelMode = "DRIVING";
    }

    var request = {
        origin: user,
        destination: des,
        travelMode: google.maps.TravelMode[travelMode]
    };

    directionsService.route(request, function (response, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(response);
        }
    });
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('directionsPanel'));
}


function changeDisable() {
    var choice = document.getElementById("placeType");
    var textbox = document.getElementById("other");
    if (choice.value == "other") {
        textbox.disabled = false;
    }
    else {
        textbox.disabled = true;
    }
}

