ML3.Layer = {
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
        
    preset: function(layerInfo){
        layerInfo.options = layerInfo.options || {};
        return ML3.Layer.preset_layers[layerInfo.name](layerInfo.options);
    },
    wfs_geoJSON: function(layerInfo){
        layerInfo.options = layerInfo.options || {};
        return new L.GeoJSON.WFS(
            layerInfo.options.url, 
            layerInfo.options.db_table, 
            layerInfo.options.options);
    },
    preset_layers : {
        osm: function(options){
            //TODO making this a class would be eaiser
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                
            var osmAttrib = options.osmAttrib || 
            'Map data © OpenStreetMap contributors';
            var minZoom = options.minZoom || 2;
            var maxZoom = options.maxZoom || 24;
            return new L.TileLayer(osmUrl, 
                {minZoom: minZoom,maxZoom: maxZoom,attribution: osmAttrib});
        }
    }
};