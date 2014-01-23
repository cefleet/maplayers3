ML3.config = {
    layers: [
        {
            //Default type of database GeoJSON WFS 
            //Type is required
            type:'wfs_geoJSON',
            name:'test',
            order:'2',
            options: {
                db_table: 'test',
                //the type will determine what options are needed below
                url:'https://mcorwfs-c9-cefleet.c9.io/wfs?',
                options:{
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
            //Default type of database GeoJSON WFS 
            //Type is required
            type:'wfs_geoJSON',
            name:'test3',
            order:'3',
            options: {
                db_table: 'test3',
                //the type will determine what options are needed below
                url:'https://mcorwfs-c9-cefleet.c9.io/wfs?',
                options : {
                    style : {
                        "color": "#ff7800",
                        "weight": 5,
                        "opacity": 0.65
                    },
                    ML3_options: {
                        hideAtZoom : 10   
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
        
    ]
};

document.addEventListener('DOMContentLoaded', function(){
    loadMap();
});

var loadMap = function(){

    ML3.map = L.map('map');

    ML3.config.layers.forEach(function(layerInfo){
        //TODO this if then thing is not great but something better will be worked dout
        ML3.Layer.addLayer(layerInfo);
    });

    
/*	
	var marker = L.marker([51.5, -0.09]).addTo(map);
	
	var circle = L.circle([51.508, -0.11], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);
  
    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(map);
    

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
  //  polygon.bindPopup("I am a polygon.");
 
   
    var popup = L.popup();

    function onMapClick(e) {
        popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(ML3.map);
    }

    ML3.map.on('click', onMapClick);
 */
 
 //Testing adding controls
    L.control.ml3Layers(
        ML3.layerGroups.base, 
        ML3.layerGroups.overlay,
        {position:'bottomleft'}).addTo(ML3.map);
 
    L.control.scale({position:"bottomright"}).addTo(ML3.map);
    
    ML3.map.setView([80.47407, 98.96484], 8);
};