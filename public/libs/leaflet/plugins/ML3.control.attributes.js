//I need Layer information to move forward with this I think
L.Control.Attributes = L.Control.extend({
    
    options: {
        position: 'topright'
    },
    
    initialize: function (layers, map, options) {
        L.setOptions(this, options);
        
        var onEachFeatureFunc = function(feature,layer){
            //this is confusing
            var _this = {layer:layer,feature:feature, control:this};
            
            layer.on('click', function(){
               this.control.view.bind(this)();
            }, 
            //the `this` of the function will be _this
            _this);
            
        }.bind(this);
        
        for(var layer in layers){
            //adds the function to start
            layers[layer].options.onEachFeature = onEachFeatureFunc;
            //when the layer is removed then added back it will add the function
            //back here
            layers[layer].on('add', function(){
                layers[layer].options.onEachFeature = onEachFeatureFunc;    
            });
        }
        
        this.map = map;
        this.addTo(this.map);
        var empty = function(e){
            var element = e.originalEvent.target;
            var exit = 1;
            while(element.parentNode && exit == 1) {
                if(hasClass(element, 'leaflet-control')){
                    exit = 0;
                }
                element = element.parentNode;
            }
            if(exit === 1){
                this.empty();
            }
        };
        
        this.map.on('mouseup',empty, this);
    },
    
    onAdd: function (map) {
        //TODO Make my own right here
        this._div = $nE('div', {"class":"panel panel-info"})
        return this._div;
    },
    
    //TODO edit and view have gotten too long. I think I need to make an "elements" 
    //Class
    view: function(){
        var props = this.feature.properties;
        //TODO add the possibility for multiple items here
        //for now just add properties
        var heading = $nE('div', {"class":"panel-heading"}, 
            //TODO attributes needs to be the title of the layer
                $nE('h4', {"class":"panel-title"}, $cTN('Atributes')));
                
        var _elem = $nE('div', {"class":"panel-body"});
        
        var DOMprops = [];
        for(var p in props){
            DOMprops.push( 
                $nE('span', {"class":"row"}, [
                    $nE('label', {"class":"col-md-4"}, $cTN(p)),
                    $nE('span', {"class":"col-md-8"}, $cTN(props[p]))
                ])
            );
        }
        //Adds an edit button
        var editButton = $nE('button', 
            {"type":"button", "class":"btn btn-primary"},
            $cTN('Edit'));
            
        DOMprops.push($nE('span', 
            {"class":"row"},editButton));
        
        editButton.addEventListener('click', function(){
            this.control.edit.bind(this)();
        }.bind(this));
        
        $aC(_elem, DOMprops);

        this.control.empty();
        $aC(this.control._div,[heading,_elem]);
    },
    
    edit : function(){
        var props = this.feature.properties;
        var heading = $nE('div', {"class":"panel-heading"}, 
            //TODO attributes needs to be the title of the layer
                $nE('h4', {"class":"panel-title"}, $cTN('Edit Atributes')));
                
        var _elem = $nE('div', {"class":"panel-body"}, 
            $nE('form', {"class":"form-horizontal", "role":"form"})
        );
        
        var DOMprops = [];
        for(var p in props){
            DOMprops.push( 
                $nE('span', {"class":"row"}, [
                    $nE('label', {"class":"col-md-4 control-label", "for":p}, $cTN(p)),
                    $nE('span', 
                        {"class":"col-md-8"}, 
                        $nE('input', 
                            {   "class":"form-control", 
                                "placeholder":p, 
                                "value":props[p],
                                "name":p
                            }
                        )
                    )
                ])
            );
        }
        
        //Adds an edit button
        var saveButton = $nE('button', 
            {"type":"button", "class":"btn btn-primary"},
            $cTN('Save'));
            
        DOMprops.push($nE('span', 
            {"class":"row"},saveButton));
        
        saveButton.addEventListener('click', function(){
            this.control.save.bind(this)();
        }.bind(this));
        
        
        var parent = _elem.childNodes[0];
        $aC(parent, DOMprops);
        
        this.control.empty();
        $aC(this.control._div, [heading, _elem]);
    },
    
    empty : function(){
        this._div.innerHTML = '';    
    },
    
    save : function(){
        var form = this.control._div.childNodes[1].childNodes[0];
        var formElements = $gBT(['input','textbox','checkbox','select'], form);

        //creates JSONArray
        var values = {};
        formElements.forEach(function(element){
            values[element.name] = element.value;
        });

        var pID = null;
        var allLayers = this.layer._map._layers;
        for(var layer in allLayers){
            if(allLayers[layer].hasLayer){
                if(allLayers[layer].hasLayer(this.layer)){
                    pID = allLayers[layer]._leaflet_id;
                    break;
                }
            }
        }
        if(pID !== null){
            var pLayer = this.layer._eventParents[pID];
            if(pLayer){
                pLayer.saveFeature(values);
            }
        }
    }
    
});

L.control.ml3Attributes = function (layers, map, options) {
    return new L.Control.Attributes(layers,map,options);
};