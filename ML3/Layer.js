/*
    The ML3 system for adding layers to the map
*/
ML3.Layer = {
    /*
        Function: addLayer
        Takes the layer configuration to create the layer then adds it to the map
        Also adds the layer to the ML3.layers object for reference
    */
    addLayer : function(layerInfo){
        if(typeof layerInfo.type === 'undefined'){
            console.log('The config information for this layer is incorrect');
            return 'error';
        } 
        layerInfo.name = layerInfo.name || 'untitled';
            
        //TODO of course I need a way to check to see if the name is already taken
        //There is a whole lot of oddness here this needs a ton of redoing
        ML3.layers[layerInfo.name] = this[layerInfo.type](layerInfo);
            
        if(layerInfo.order === 'base'){
            ML3.layerGroups.base[layerInfo.name] = ML3.layers[layerInfo.name];
        } else {
            ML3.layerGroups.overlay[layerInfo.name] = ML3.layers[layerInfo.name];
        }
            
        ML3.map.addLayer(ML3.layers[layerInfo.name]);
    },
    
    /*
        Function:preset
        If the layer's config says that it is a preset it will run through
        this function and then call the needed preset_function for that layer
    */
    preset: function(layerInfo){
        layerInfo.options = layerInfo.options || {};
        return ML3.Layer.preset_layers[layerInfo.name](layerInfo.options);
    },
    
    /*
        Funciton:wfs_geoJSON
        This creates a layer that connects to a wfs server. layerInfo is an object
        that must have : db_table, url {db_table:'layer_name', url:"http://this.domain.com/wfs?'
    */
    wfs_geoJSON: function(layerInfo){
        layerInfo.options = layerInfo.options || {};
        return new L.GeoJSON.WFS(
            layerInfo.options.url, 
            layerInfo.options.db_table, 
            layerInfo.options.options);
    },
    
    /*
        This is an object that contains the functions of the various preset_layers
    */
    preset_layers : {
        /*
            Function:osm
            This layer creates an OSM standard layer. the only options are:
            minZoom (0-24), maxZoom (0-24)
        */
        osm: function(options){
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                
            var osmAttrib = options.osmAttrib || 
            'Map data &copy; OpenStreetMap contributors';
            var minZoom = options.minZoom || 2;
            var maxZoom = options.maxZoom || 24;
            return new L.TileLayer(osmUrl, 
                {minZoom: minZoom,maxZoom: maxZoom,attribution: osmAttrib});
        }
    }
};