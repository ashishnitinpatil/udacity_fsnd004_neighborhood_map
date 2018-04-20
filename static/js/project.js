$(document).ready(function() {
    // set height & width of the map div w.r.t. window height & navbar dims
    function setMapDimensions() {
        mapHeight = $(window).innerHeight() - $('#navbar').innerHeight();
        $('#map').css('min-height', mapHeight);
        $('#map').css('max-width', $('#navbar').innerWidth());
        if (typeof google != "undefined") {
            google.maps.event.trigger(map, "resize");
        }
    };

    // trigger once at start
    setMapDimensions();

    // trigger on window resize
    $(window).resize(function() {
        setMapDimensions();
    });

    // trigger on navbar toggle
    $('.navbar-toggler').click(function() {
        $('#sidebar').toggle();
        setMapDimensions();
    });
});


function viewModel() {
    var self = this;

    self.search = ko.observable("");
    self.markers = ko.observableArray();

    // Generate infoWindow content when a marker is clicked
    // display based on the markers position (hide / destroy previous windows)
    this.generateInfoWindow = function(marker, infoWindow) {
        if (infoWindow.marker != marker) {
            // nothing to do if already highlighted marker is clicked
            infoWindow.setContent('Loading...');
            infoWindow.marker = marker;
            htmlContent = '<div class="info-window">' +
                '<h4 class="title">' + marker.title + '</h4>';
            // Foursquare API Client
            fourSquareId = "HKLL4RY4CSVIM33GEHHMYQWAVVRBUH4ACQAYUE3YZLUYXXUO";
            fourSquareSecret = "PM3VSO0VVTUIV0HZ0NPKKYTBGS2OYHVLOUZDRCE2STFU3LHU";
            // URL for Foursquare API
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?' +
                'll=' + marker.lat + ',' + marker.lng +
                '&query=' + marker.title +
                '&v=20180421' +
                '&client_id=' + fourSquareId +
                '&client_secret=' + fourSquareSecret;
            // Foursquare API
            $.getJSON(apiUrl).done(function(marker) {
                if(!marker.response.venues) {
                    infoWindow.setContent(htmlContent +
                                          '<p>No extra info found.</p>');
                    return null;
                }
                response = marker.response.venues[0];
                street = response.location.formattedAddress[0];
                neighborhood = response.location.neighborhood || '';

                htmlContentFourSquare = '<p> Address: ' +
                    street + neighborhood + '</p></div>';

                infoWindow.setContent(htmlContent + htmlContentFourSquare);
            }).fail(function() {
                alert("Erred while fetching data from the Foursquare API." +
                      " Kindly refresh the page to retry.");
            });

            infoWindow.open(map, marker);

            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });
        }
    };

    self.getInfoAndAnimate = function() {
        // this refers to the marker, while self refers to the viewModel
        self.generateInfoWindow(this, self.infoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 2000);
    };

    self.initMap = function() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: {lat: 25.24, lng: 55.35}
        });

        mosques.forEach(function(mosque, i) {
            let marker = new google.maps.Marker({
                position: {lat: mosque.lat, lng: mosque.lng},
                map: map,
                title: mosque.name,
                lat: mosque.lat,
                lng: mosque.lng,
                id: i,
            });
            marker.addListener('click', self.getInfoAndAnimate);
            marker.bounce = function(place) {
                google.maps.event.trigger(marker, 'click');
            };
            self.markers.push(marker);
        })
    }
    self.initMap();
    self.infoWindow = new google.maps.InfoWindow();

    self.filteredLocations = ko.computed(function() {
        var locations = [];
        var search = self.search();
        for (var i=0; i < self.markers().length; i++) {
            var marker = self.markers()[i];
            if (!search || marker.title.toLowerCase().includes(search.toLowerCase())) {
                locations.push(marker);
                self.markers()[i].setVisible(true);
            } else {
                self.markers()[i].setVisible(false);
            }
        }
        return locations;
    }, self).extend({ rateLimit: 50 });;
}


function init() {
    ko.applyBindings(new viewModel());
}