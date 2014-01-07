var M3 = {
    
    layers:[],
    
    //Configs will be loaded
    configs : {
        layers : [
            {
                name: 'Mapquest',
                source : 'MapQuestOpenAerial'
            }
        ]
    },
    
    //Function fired after all loading is done
    init: function(){
        this._init_add_layers();

        this.map = new ol.Map({
            target: 'map',
    
            layers: this.layers,
        
            view: new ol.View2D({
                center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4
            })
        });
        
    },
    
    //Creates the layers from the config
    _init_add_layers : function(){
        this.configs.layers.forEach(function(layer){
            
            this.layers.push(this.create_layer(layer));
            
        }.bind(this));
    },
    
    //Creates a layer
    create_layer : function(layer){
        return new ol.layer.Tile({
            source: new ol.source[layer.source]
        });
    }
}; 