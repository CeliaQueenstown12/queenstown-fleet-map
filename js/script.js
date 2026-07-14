function inicializarMapa() {

    const mapa = new google.maps.Map(document.getElementById("map"), {

        center: {
            lat: 40.4168,
            lng: -3.7038
        },

        zoom: 6,

        mapTypeControl: false,

        streetViewControl: false,

        fullscreenControl: true

    });
    
    const marcador = new google.maps.Marker({

    position: {
        lat: 43.206943,
        lng: -2.034616
    },

    map: mapa,

    title: "Andoain"

});

}