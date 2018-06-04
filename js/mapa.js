    var map;
    var infoWindow;
    var geocoder;

    function initMap() {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      geocoder = new google.maps.Geocoder();
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: -15.7942287,
          lng: -47.8821658
        },
        zoom: 15
      });

      infoWindow = new google.maps.InfoWindow({
        map: map,
        maxWidth: 200
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          let usuario_marker = new google.maps.Marker({
            map: map,
            title: 'Você',
            icon: 'css/img/usuario-marker.png',
            animation: google.maps.Animation.DROP
          });

          usuario_marker.setPosition(pos);
          map.setCenter(pos);
          infoWindow = new google.maps.InfoWindow({
            maxWidth: 200
          });

          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: pos,
            radius: 5000,
            type: ['library']
          }, callback);

          function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
              }
            }
          }

          function createMarker(place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {
              service.getDetails(place, function (details, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  infoWindow.setContent(place.name + '<br> <button type="button" id="salvar">Salvar Endereço</button>');
                  console.log(details.formatted_address);
                  var buttonSalvar = document.querySelector("#salvar");
                  buttonSalvar.addEventListener('click', function (params) {
                    if (localStorage.getItem('bibliotecas') != null) {
                      if (localStorage.getItem('bibliotecas').indexOf(details.name) === -1) {
                        Persistencia.adiciona(
                          'bibliotecas', {
                            nome: details.name,
                            endereco: details.formatted_address
                          });
                      }
                    } else {
                      Persistencia.adiciona(
                        'bibliotecas', {
                          nome: details.name,
                          endereco: details.formatted_address
                        });
                      localStorage.setItem('nome', details.name);

                    }
                    infoWindow.close();
                  });
                }

                geocodePosition(pos);
                function geocodePosition(pos) {
                  var endereco;
                  geocoder.geocode({
                    latLng: pos
                  }, function (responses) {
                    if (responses && responses.length > 0) {
                      usuario_marker.formatted_address = responses[0].formatted_address;
                      var enderecoPartida = responses[0].formatted_address;
                      var enderecoChegada = details.formatted_address;
                      var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
                        origin: enderecoPartida, // origem
                        destination: enderecoChegada, // destino
                        travelMode: google.maps.TravelMode.DRIVING // meio de transporte, nesse caso, de carro
                      };
                      directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
                          directionsDisplay.setDirections(response); // Renderizamos no mapa o resultado
                          directionsDisplay.setMap(map);
                        }
                      });

                    } else {
                      usuario_marker.formatted_address = 'Cannot determine address at this location.';
                    }
                  });

                }

              });
              infoWindow.open(map, this);
            });

          }


        }, function () {
          handleLocationError(true, infoWindow, map.getCenter());
        }, {
          enableHighAccuracy: true,
          maximumAge: 20000,
          timeout: 20000
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

    }