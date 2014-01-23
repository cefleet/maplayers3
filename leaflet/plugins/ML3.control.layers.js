L.Control.Layers.ML3 = L.Control.Layers.extend({
    options: {
        collapsed: true,
        position: 'topright',
        autoZIndex: true
    },
    
    /*
        Function:_addLayers
        Adds a layer to the controls. All from source but adds the ML# checker
    */
    _addLayer: function (layer, name, overlay) {
        layer.options.ML3_options = layer.options.ML3_options || {};
        //From here 
        layer.on('add remove', this._onLayerChange, this);

        var id = L.stamp(layer);

        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };
        
        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
        //To here is the source. I don't know why call will not work here
        
        //if it is an overlay look for the options
        if(overlay){
            //We are using the ML3 version of these controls so we just add
            //the options if they do not exists
            this._ML3Checks(layer);
        }
    },
    
    /*
        Funciton : _addItem
        Adds Items to a loayer. Not really sure all of what it does because it is
        mostly from source. This version adds an extra wrapper around the label
        item and gives a place for the layers to add some extra functionallity
    */
    _addItem: function (obj) {
        var label = document.createElement('label'),
            checked = this._map.hasLayer(obj.layer),
            input;

        if (obj.overlay) {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'leaflet-control-layers-selector';
            input.defaultChecked = checked;
        } else {
            input = this._createRadioElement('leaflet-base-layers', checked);
        }

        input.layerId = L.stamp(obj.layer);
        L.DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        label.appendChild(input);
        label.appendChild(name);

        //creates new object inside the span to be created
        var liInside = document.createElement('span');
        liInside.appendChild(label);
        
        //checks to see if it is an ML3 object
        obj.layer.options.ML3_options._input = input;
        if(typeof obj.layer.options.ML3_options.button !== 'undefined'){
            liInside.appendChild(this._makeButton(obj.layer));
        }
        
        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
        container.appendChild(liInside);

        return liInside;
    },
    
    /*
        Function:_ML3Checks
        Cheks for the various possible added capabilities of the layer upon creation
        It is called from _addLayer for overlays layers
    */
    _ML3Checks : function(layer){
        //This needs to be after the input object is already created so it can disable it if nessessary
        if(typeof layer.options.ML3_options.hideAtZoom !== 'undefined'){
            this._setupHideLevel(layer);   
        }
        //As we make the other options we will add a check for them here
    },
    
    /*
        Function: _makeButton
        Creates a button with an optional function 
        //TODO needs work on styling
    */
    _makeButton : function(layer){
        var button = document.createElement('span');
        //TODO should I create a css File??
        //TODO yes yes you should 
        button.style.border = '1px solid';
        button.style.margin = '3px';
        button.style.padding = '4px 8px';
        button.style.float = 'right';
        button.style['border-radius'] = '10px';
        button.style.cursor = 'pointer';
           
        button.appendChild(
            document.createTextNode(
                layer.options.ML3_options.button.buttonText
            )
        );
        
        var action = layer.options.ML3_options.button.action || 
            function(){console.log('No function was given')};
        button.addEventListener('click', action.bind(layer));
        
        return button;
    },

    /*
        Function: _setupHideLevel
        called from _ML3Checks. Sets up the the checking of weither or not
        a layer is visible at a specifi zooom level. Also keeps track to see
        if a layer was removed due to zoom level or because it was unchecked. 
    */
    _setupHideLevel : function(layer){
        layer.options.ML3_options._checkedState = 'on';
        
        var map = layer.map || layer._mapToAdd; //if the map is not ready then _mapToAdd is used

        layer.on('remove', function(){
            if(!layer.options.ML3_options._removingBecauseZoomLevel){
                layer.options.ML3_options._checkedState = 'off';   
            }
        }, layer);
        
        layer.on('add', function(){
            if(!layer.options.ML3_options._removingBecauseZoomLevel){
                layer.options.ML3_options._checkedState = 'on';   
            }
        }, layer);
        
        map.on('moveend', function(){
            var zoomLvl = this.map.getZoom();

            if(this.options.ML3_options.hideAtZoom <= zoomLvl){
                if(this.options.ML3_options._checkedState == 'on'){
                    this.map.addLayer(this);
                }
                this.options.ML3_options._input.disabled = false;
                
            } else {
                
                layer.options.ML3_options._removingBecauseZoomLevel = true;

                this.map.removeLayer(this);
                this.options.ML3_options._input.disabled = true;
                
                delete layer.options.ML3_options._removingBecauseZoomLevel;

            }
        }, layer);
    }
});
L.control.ml3Layers = function (baseLayers, overlays, options) {
        return new L.Control.Layers.ML3(baseLayers, overlays, options);
};