//socket io
document.addEventListener('DOMContentLoaded', function(){
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
    });
});

var loadMap = function(){
    var map = $g('map');
    map.style.height = ML3.config.size.height+'px';
    map.style.width = ML3.config.size.width+'px';
    
    //creates the map!
    ML3.map = L.map('map');

    //adds the layers from config
    ML3.config.layers.forEach(function(layerInfo){
        
        //This modifies the layer info ... probably only need to try this on 
        //vector and wfs .. but yah know
        layerInfo = ML3.Style.make_style(layerInfo);
        /*
        try {
            
        if(layerInfo.options.options.style.generateStyle){
           layerInfo.options.options.style = 
            ML3.Style.make_style(
                layerInfo.options.options.style, 
                layerInfo.options.options.style_schema);
        }
        } catch(e){}
        */
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
    ML3.map.setView(ML3.config.map.view.loc, ML3.config.map.view.zoom);
};