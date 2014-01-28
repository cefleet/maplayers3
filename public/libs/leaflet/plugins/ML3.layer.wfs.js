/*
    WFS client
    Author: Clint Fleetwood / Mclean Enginerring
    Licesne : GNU
*/

/*TODO add a dynamic or static option. 
    This would tell it to load everything once (static) and don't look for it again
    or to request based on bbox(dynamic) where you load items regularly and 
    get new attributes more often.
*/
L.GeoJSON.WFS = L.GeoJSON.extend({
    
    initialize: function(serviceUrl, featureType, options) {
        options = options || {};
        
        //TODO this should only be if the layer is clickable
        /*
        options.onEachFeature = function(feature,layer){
            //layer.bindPopup(feature.properties.name);
            layer.on('click', function(){
                console.log(this);
                
            }, {layer:layer,feature:feature});
        };
        */
        L.GeoJSON.prototype.initialize.call(this, null, options);
        
        //default is going to be 2.0.0 from now on
        var wfsVersion = options.wfsVersion || "2.0.0";
        var request = 'GetFeature'; // Only request of 'GetFeature'
        var format = 'json'; //Only json output is accepted
        
        //creates the url
        this.getFeatureUrl = serviceUrl + 
            "&service=wfs&request=" + request + "&outputformat=" + format +
            "&version=" + wfsVersion + "&typeName=" + featureType;
    },
    
    /*
        Function: onAdd 
        called by the map when the layerGroup is added. Do not acces directly.
        extends the `onAdd` function from LayerGroup by adding the 
        moveend event listener.
    */
    onAdd: function(map) {
        L.LayerGroup.prototype.onAdd.call(this, map);
        this.map = map;
        this.map.on('moveend', this._getData, this);
    },
    
    /*
        Function: onRemove
        called by the map when the layerGroup is removed. Do not acces directly.
        extends the `onRemove` function from LayerGroup by removing the 
        moveend event listener.
    */
    /*
        Function: saveFeature
        Saves the supplied data to the server using WFS-T (or my attempt at making it)
    */
    saveFeature : function(data){
        console.log(data);
        console.log(this);
    },
    
    onRemove: function(map){
        this.map.off('moveend',this._getData, this);
        
        //This below cause `this` to become map instead of the layer
        L.LayerGroup.prototype.onRemove.call(this, map);
    },
  
    /*
        Function: _getData
        called by the the moveend event. Creates a bbox and sends a request
        to the wfs server using the bbox. Clears the old data and then adds the
        new data back. This is helpful where there is thousands of items on the 
        screen
    */
    //TODO possibly have a slight delay here to see if it is still moving .. so 
    //it will not try to hit the DB over and over again
    
    //TODO also have an opportunity for this to be dumped into memory or something
    //to allow for localized caching on the fly
    _getData : function(){
        var bounds = this.map.getBounds();
        var bbox = [
            bounds._southWest.lat,
            bounds._southWest.lng,
            bounds._northEast.lat,
            bounds._northEast.lng
        ];
        bbox = bbox.toString();
        $.getJSON(this.getFeatureUrl+'&bbox='+bbox, function(data) {
            this.clearLayers();
            this.addData(data);
        }.bind(this));
    }
});