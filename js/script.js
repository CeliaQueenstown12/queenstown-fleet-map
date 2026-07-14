/*
==========================================================
Queenstown Fleet Map
Versión 2.0
==========================================================
*/

let mapa;
let marcadores = [];
let ventanaInfo;
let estaciones = [];
let limites;

async function inicializarMapa() {

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

    ventanaInfo = new google.maps.InfoWindow();

    limites = new google.maps.LatLngBounds();

    await cargarEstaciones();

    activarBuscador();

}

async function cargarEstaciones(){

    const respuesta = await fetch("data/estaciones.json");

    estaciones = await respuesta.json();

    estaciones.forEach(crearMarcador);

    mapa.fitBounds(limites);

}

function crearMarcador(estacion){

    const marcador = new google.maps.Marker({

        position:{
            lat:estacion.latitud,
            lng:estacion.longitud
        },

        map:mapa,

        title:estacion.nombre

    });

    marcador.estacion = estacion;

    marcador.addListener("click",function(){

        mostrarFicha(this.estacion,this);

    });

    marcadores.push(marcador);

    limites.extend(marcador.getPosition());

}
function mostrarFicha(estacion, marcador) {

    const contenido = `
        <div style="min-width:260px;font-family:Arial,Helvetica,sans-serif;">

            <h2 style="
                margin:0;
                color:#343434;
                font-size:20px;
                margin-bottom:12px;
            ">
                ${estacion.nombre}
            </h2>

            <div style="
                color:#666;
                margin-bottom:18px;
                font-size:15px;
            ">
                <strong>Proveedor:</strong> ${estacion.proveedor}
            </div>

            <a
                href="${estacion.maps}"
                target="_blank"
                style="
                    display:block;
                    text-align:center;
                    background:#FFB101;
                    color:#222;
                    text-decoration:none;
                    padding:12px;
                    border-radius:8px;
                    font-weight:bold;
                "
            >
                🧭 Navegar con Google Maps
            </a>

        </div>
    `;

    ventanaInfo.setContent(contenido);

    ventanaInfo.open({
        anchor: marcador,
        map: mapa
    });

}

function activarBuscador() {

    const caja = document.getElementById("buscar");

    caja.addEventListener("keyup", function () {

        const texto = this.value.toLowerCase().trim();

       if (texto === "") {

    marcadores.forEach(function (marcador) {

        marcador.setVisible(true);

    });

    mapa.fitBounds(limites);

    return;

}

        let encontrado = false;

        marcadores.forEach(function (marcador) {

            const nombre = marcador.estacion.nombre.toLowerCase();

            if (nombre.includes(texto)) {

                marcador.setVisible(true);

                if (!encontrado) {

                    encontrado = true;

                    mapa.setZoom(13);

                    mapa.panTo(marcador.getPosition());

                }

            } else {

                marcador.setVisible(false);

            }

        });

    });

}
function mostrarTodosLosMarcadores() {

    marcadores.forEach(function (marcador) {

        marcador.setVisible(true);

    });

    mapa.fitBounds(limites);

}

function localizarConductor() {

    if (!navigator.geolocation) {

        console.log("Geolocalización no disponible.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function (posicion) {

            const ubicacion = {

                lat: posicion.coords.latitude,

                lng: posicion.coords.longitude

            };

            new google.maps.Marker({

                position: ubicacion,

                map: mapa,

                title: "Mi ubicación",

                icon: {

                    path: google.maps.SymbolPath.CIRCLE,

                    scale: 8,

                    fillColor: "#0B84FF",

                    fillOpacity: 1,

                    strokeColor: "#FFFFFF",

                    strokeWeight: 3

                }

            });

        },

        function () {

            console.log("No se ha podido obtener la ubicación.");

        }

    );

}

// Restaurar marcadores cuando se limpia el buscador

document.addEventListener("DOMContentLoaded", function () {

    const buscador = document.getElementById("buscar");

    if (buscador) {

        buscador.addEventListener("search", mostrarTodosLosMarcadores);

        buscador.addEventListener("change", function () {

            if (this.value === "") {

                mostrarTodosLosMarcadores();

            }

        });

    }

});

// Localizar automáticamente al conductor cuando el mapa termina de cargar

window.addEventListener("load", function () {

    setTimeout(function () {

        localizarConductor();

    }, 1500);

});