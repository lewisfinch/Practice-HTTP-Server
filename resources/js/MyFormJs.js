
let map;
function initMap() {
    const origin = { lat: 44.9727, lng: -93.23540000000003 }
    map = new google.maps.Map(document.getElementById("formMap"), {
        center: origin,
        zoom: 14,
    });
    new ClickEventHandler(map, origin);
}


function isIconMouseEvent(e) {
    return "placeId" in e;
}

class ClickEventHandler {
    origin;
    map;
    placesService;

    constructor(map, origin) {
        this.origin = origin;
        this.map = map;
        this.placesService = new google.maps.places.PlacesService(map);
        this.map.addListener("click", this.handleClick.bind(this));
    }
    handleClick(event) {
        console.log("You clicked on: " + event.latLng);
        if (isIconMouseEvent(event)) {
            console.log("You clicked on place:" + event.placeId);
            if (event.placeId) {
                this.getPlaceInformation(event.placeId);
            }
        }
    }
    getPlaceInformation(placeId) {
        const me = this;
        this.placesService.getDetails({ placeId: placeId }, (place, status) => {
            if (
                status === "OK" &&
                place &&
                place.geometry &&
                place.geometry.location
            ) {
                var location = document.getElementById("location");
                new google.maps.places.Autocomplete(location);
                location.value = place.formatted_address;
            }
        });
    }
}

window.initMap = initMap;

