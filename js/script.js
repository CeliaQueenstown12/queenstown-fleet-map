alert("Script cargado");

/*
--------------------------------------------------
Queenstown Fleet Map
Versión 1.0.0
--------------------------------------------------
*/

let mapa;

async function inicializarMapa() {

    // Crear el mapa centrado en España

    mapa = new google.maps.Map(document.getElementById("map"), {

        center: {
            lat: 40.4168,
            lng: -3.7038
        },

        zoom: 6,

        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true

    });

    // Leer el archivo de estaciones

    const respuesta = await fetch("data/estaciones.json");

    const estaciones = await respuesta.json();

    // Caja que utilizará Google para calcular el zoom

    const limites = new google.maps.LatLngBounds();

    // Crear una chincheta por cada estación

    estaciones.forEach(estacion => {

        const marcador = new google.maps.Marker({

            position: {
                lat: estacion.latitud,
                lng: estacion.longitud
            },

            map: mapa,

            title: estacion.nombre

        });

        // Añadir la estación a los límites

        limites.extend(marcador.getPosition());

    });

    // Ajustar automáticamente el mapa

    mapa.fitBounds(limites);

}