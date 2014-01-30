var wfsPort = 'http://23.253.35.36:1010/';
ML3.config = {
    scale: {
        show: true,
        options:{
            //should have a mobile version
            maxWidth: 200,
            imperial:true,
            metric:false,
            position:'bottomright'
        }
    },
    
    layers: [
        {
            type:'wfs_geoJSON',
            name:'test',
            order:'2',
            clickable:true,
            options: {
                db_table: 'conductor',
                url:wfsPort+'wfs?',
                options:{
                    style : {
                        "color": "#ff7800",
                        "weight": 5,
                        "opacity": 0.65
                    },
                    ML3_options: {
                        button:{
                            buttonText : 'Options',
                            action : function(){
                                console.log('this is ever more impressive');
                                console.log(this);
                            }
                        }
                    }
                }
            },
        },
        {
            //Type is required
            type:'wfs_geoJSON',
            name:'test3',
            order:'3',
            clickable:false,
            options: {
                db_table: 'structure',
                url:wfsPort+'wfs?',
                options : {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "#ff7800",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    },
                    ML3_options: {
                        hideAtZoom : 16   
                    }
                }
            }
        },
        {
            type:'preset',
            name:'osm',
            order:'base',
            options: {}
        }
        
    ],
    size : {
        height:document.documentElement.clientHeight,
        width:document.documentElement.clientWidth
    }
};

document.addEventListener('DOMContentLoaded', function(){
    //the ioconnect needs to be the port/
    //TODO this 
    console.log('get this party started');
    var listen = 'http://23.253.35.36:1999/';
    var socket = io.connect(listen);
    
    //mapId needs to be pulled from the
    var mapId = 'df665e0f-3335-44d1-afbd-e72628bee0b7';
    
    socket.emit('getConfig',{mapId:mapId});
    
    socket.on('ready', function (data) {
        if(data.status ==='ready'){
            var script = document.createElement("script");
            script.src = "configs/config.js";
            script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(script);
        }
       // ML3.config = data;
        
        ML3.config.size = {
            height:document.documentElement.clientHeight,
            width:document.documentElement.clientWidth
        };
        
       // loadMap();
    });
    
    //TODO do an observer for when the height or width changes
    
    var map = $g('map');
    map.style.height = ML3.config.size.height+'px';
    map.style.width = ML3.config.size.width+'px';
    //loadMap();
});

var loadMap = function(){
    //creates the map!
    ML3.map = L.map('map');

    //adds the layers from config
    ML3.config.layers.forEach(function(layerInfo){
        ML3.Layer.addLayer(layerInfo);
    });
    
    //Testing adding controls
    L.control.ml3Layers(
        ML3.layerGroups.base, 
        ML3.layerGroups.overlay,
        {position:'bottomleft'}).addTo(ML3.map);
 
    if(ML3.config.scale.show){
        //Adds a scale .. should be configurable 
        L.control.scale(ML3.config.scale.options).addTo(ML3.map);
    }
    
    //Testing with some junk
    ML3.attributesBox = 
        L.control.ml3Attributes(ML3.layerGroups.overlay,ML3.map);

    //sets the map view 
    ML3.map.setView([31.191804849767344,-84.26693916320802], 12);
};