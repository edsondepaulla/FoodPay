var Maps = {
    this: null,
    markers: [],
    timeoutGetPoints: null,
    getPoints: function(time){
        try {
            if (Maps.timeoutGetPoints)
                clearTimeout(Maps.timeoutGetPoints);

            Maps.timeoutGetPoints = setTimeout(function () {
                var bounds = Maps.this.getBounds();
                if(bounds) {
                    var ne = bounds.getNorthEast();
                    var sw = bounds.getSouthWest();
                    var nw = new google.maps.LatLng(ne.lat(), sw.lng());
                    var se = new google.maps.LatLng(sw.lat(), ne.lng());
                    Factory.ajax(
                        {
                            action: 'estabecimentos/getpoints',
                            data: {
                                NE_LAT: ne.lat(),
                                SW_LNG: sw.lng(),
                                SW_LAT: sw.lat(),
                                NE_LNG: ne.lng(),
                                IDS_DIF: Object.keys(Maps.markers)
                            }
                        },
                        function (data) {
                            $.each(data.lst, function (index, val) {
                                if (!Maps.markers[val.ID]) {
                                    var latlng = new google.maps.LatLng(val.LAT, val.LNG);

                                    var image = {
                                        url: 'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-2-medium.png,assets/icons/poi/tactile/pinlet_outline_v2-2-medium.png,assets/icons/poi/tactile/pinlet-2-medium.png,assets/icons/poi/quantum/pinlet/restaurant_pinlet-2-medium.png&highlight=ff000000,ffffff,db4437,ffffff&color=ff000000?scale=1',
                                        labelOrigin: new google.maps.Point(15, 40)
                                    }
                                    var marker = new google.maps.Marker({
                                        position: latlng,
                                        map: Maps.this,
                                        icon: image,
                                        ID: val.ID,
                                        labelClass: "labels",
                                        labelStyle: {opacity: 0.75},
                                        label: {
                                            text: val.ID + ' - ' + val.NOME,
                                            fontSize: "15px"
                                        }
                                    });
                                    marker.addListener('click', function () {
                                        window.location = '#!/estabelecimentos/' + marker.ID;
                                    });
                                    Maps.markers[val.ID] = marker;
                                }
                            });
                        }
                    );
                }else
                    Maps.getPoints(time);
            }, time ? time : 1000);
        } catch (err) {
            Maps.getPoints(time);
        }
    },
    markerLocation: null,
    latLngLocation: function(latLng) {
        if (latLng)
            localStorage.setItem("latLngLocation",
                JSON.stringify(
                    {
                        latitude: latLng.latitude,
                        longitude: latLng.longitude
                    }
                )
            );
        else {
            latLng = JSON.parse(localStorage.getItem("latLngLocation"));
            if (!latLng) {
                latLng = {
                    latitude: -25.54851685515094,
                    longitude: -49.351594296932774
                };
            }
        }

        return (latLng ? new google.maps.LatLng(latLng.latitude, latLng.longitude) : null);
    },
    geoLocation: function(getpoints) {
        var latLngLocation = Maps.latLngLocation();
        if(latLngLocation){
            Maps.this.setZoom(17);
            Maps.this.setCenter(latLngLocation);
        }
        if (Maps.markerLocation == null) {
            Maps.markerLocation = new google.maps.Marker({
                map: Maps.this,
                position: latLngLocation,
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAF96VFh0UmF3IHByb2ZpbGUgdHlwZSBBUFAxAABo3uNKT81LLcpMVigoyk/LzEnlUgADYxMuE0sTS6NEAwMDCwMIMDQwMDYEkkZAtjlUKNEABZgamFmaGZsZmgMxiM8FAEi2FMnxHlGkAAADqElEQVRo3t1aTWgTQRQOiuDPQfHs38GDogc1BwVtQxM9xIMexIN4EWw9iAehuQdq0zb+IYhglFovClXQU+uhIuqh3hQll3iwpyjG38Zkt5uffc4XnHaSbpLZ3dnEZOBB2H3z3jeZN+9vx+fzYPgTtCoQpdVHrtA6EH7jme+/HFFawQBu6BnWNwdGjB2BWH5P32jeb0V4B54KL5uDuW3D7Y/S2uCwvrUR4GaEuZABWS0FHhhd2O4UdN3FMJneLoRtN7Y+GMvvUw2eE2RDh3LTOnCd1vQN5XZ5BXwZMV3QqQT84TFa3zuU39sy8P8IOqHb3T8fpY1emoyMSQGDI/Bwc+0ELy6i4nLtepp2mE0jc5L3UAhMsdxut0rPJfRDN2eMY1enF8Inbmj7XbtZhunkI1rZFD/cmFMlr1PFi1/nzSdGkT5RzcAzvAOPU/kVF9s0ujqw+9mP5QgDmCbJAV7McXIeGpqS3Qg7OVs4lTfMD1Yg9QLR518mZbImFcvWC8FcyLAbsev++3YETb0tn2XAvouAvjGwd14YdCahUTCWW6QQIzzDO/CIAzKm3pf77ei23AUkVbICHr8pnDZNynMQJfYPT7wyKBzPVQG3IvCAtyTsCmRBprQpMawWnkc+q2Rbn+TK/+gmRR7qTYHXEuZkdVM0p6SdLLYqX0LItnFgBxe3v0R04b5mGzwnzIUMPiBbFkdVmhGIa5tkJ4reZvyl4Rg8p3tMBh+FEqUduVRUSTKTnieL58UDG76cc70AyMgIBxs6pMyIYV5agKT9f/ltTnJFOIhuwXOCLD6gQ/oc8AJcdtuYb09xRQN3NWULgCwhfqSk3SkaBZViRTK3EYNUSBF4Hic0Y8mM+if0HhlMlaIHbQ8Z5lszxnGuIP2zrAw8J8jkA7pkMAG79AKuPTOOcgWZeVP5AsSDjAxWegGyJoSUWAj/FBpRa0JiviSbfldMqOMPcce7UVeBLK4gkMVVBLI2phLjKlIJm8lcxMNkLuIomXOTTmc1kwYf2E+nMQdzlaTTKgoaZJWyBQ141RY0DkrK6XflAQbih1geZnhJeXu5WeEZ3mVqSkrIgCzXJaXqoh65TUuLerdtFXgQ2bYKeD1pq6hobLE86SlztXMWvaA5vPO0sYWB9p2K1iJS4ra0Fju/udsN7fWu+MDRFZ+YuuIjX1d8Zu2OD92WC9G3ub1qABktBV7vssfBMX1L7yVjZ7PLHuABb9svezS7boNDyK/b4LdX123+Au+jOmNxrkG0AAAAAElFTkSuQmCC'
            });
            Maps.markerLocation.addListener('click', function() {
                Maps.this.setZoom(17);
                Maps.this.setCenter(Maps.latLngLocation());
            });
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    latLngLocation = Maps.latLngLocation(position.coords);
                    Maps.markerLocation.setPosition(latLngLocation);
                    Maps.this.setCenter(latLngLocation);
                    Maps.this.setZoom(17);
                    if(getpoints)
                        Maps.getPoints(1);
                },
                function (error) {

                }
            );
        }else if(getpoints)
            Maps.getPoints(1);
    }
}

function initMap() {
    Maps.this = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        disableDefaultUI: true
    });
    Maps.this.setCenter(Maps.latLngLocation());

    Maps.this.setOptions(
        {
            styles: [
                {
                    featureType: "poi",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        }
    );

    google.maps.event.addListener(Maps.this, 'click', function(event) {
        Factory.ajax(
            {
                action: 'estabecimentos/setpoint',
                data: {
                    LAT: event.latLng.lat(),
                    LNG: event.latLng.lng()
                }
            },
            function (data) {
                Maps.getPoints(1);
            }
        );
    });

    google.maps.event.addListener(Maps.this, 'zoom_changed', function(event) {
        /*
         zoomLevel = Maps.this.getZoom();
         if (zoomLevel >= minFTZoomLevel) {
         FTlayer.setMap(Maps.this);
         } else {
         FTlayer.setMap(null);
         }*/
        Maps.getPoints();
    });

    google.maps.event.addListener(Maps.this, 'dragend', function(event) {
        Maps.getPoints();
    });

    Maps.geoLocation(true);
}