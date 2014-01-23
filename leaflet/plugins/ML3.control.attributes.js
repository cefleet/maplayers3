//I need Layer information to move forward with this I think
L.Control.Attributes = L.Control.extend({
    
    options: {
        position: 'topright'
    },
    
    initialize: function (layers, map, options) {
        L.setOptions(this, options);
        
        var onEachFeatureFunc = function(feature,layer){
            var _this = {layer:layer,feature:feature, _this:this}
            layer.on('click', function(){
               this._this.update.bind(this._this)(this.feature);
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
        var empty = function(){
            this.empty();
        };
        
        this.map.on('click',empty, this);
    },
    
    onAdd: function (map) {
        //TODO Make my own right here
        //this._div = L.DomUtil.create('div', 'info');
        this._div = $nE('div', {"class":"ML3_attributesPanel"})
        //this.update();
        return this._div;
    },
    
    /*
    onRemove: function(map){
        
    },
    */
    
    update: function(obj){
        this.empty();
        obj = obj || {};
        var props = obj.properties;
        //TODO add the possibility for multiple items here
        //for now just add properties
        var _elem = $nE('div', {"class":"ML3_attributes"},
            $nE('ul', {'class':"ML3_attributesList"}, [
                $nE('ul', {"class":"ML3_attributeList"})   
            ])
        );
        
        var DOMprops = [];
        for(var p in props){
            DOMprops.push($nE('li', {"class":"ML3_attribute"}, 
                $nE('span', {}, [
                    $nE('label', {}, $cTN(p)),
                    $nE('span', {}, $cTN(props[p]))
                ])
            ));
        }
        
        var parent = _elem.childNodes[0].childNodes[0];
        $aC(parent, DOMprops);

        $aC(this._div,[_elem]);
    },
    
    empty : function(obj){
        this._div.innerHTML = '';    
    }
});

L.control.ml3Attributes = function (layers, map, options) {
    return new L.Control.Attributes(layers,map,options);
};