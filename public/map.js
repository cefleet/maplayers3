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
                db_table: 'test',
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
            //Type is required
            type:'wfs_geoJSON',
            name:'test3',
            order:'3',
            clickable:false,
            options: {
                db_table: 'test3',
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
        
    ],
    size : {
        height:document.documentElement.clientHeight,
        width:document.documentElement.clientWidth
    }
};

document.addEventListener('DOMContentLoaded', function(){
    //set the size
    //TODO do an observer for when the height or width changes
    var map = $g('map');
    map.style.height = ML3.config.size.height+'px';
    map.style.width = ML3.config.size.width+'px';
    loadMap();
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
    ML3.map.setView([80.47407, 98.96484], 8);
};