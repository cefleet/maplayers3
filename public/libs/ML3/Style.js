/*
    The functions nessessary to make a style
*/
ML3.Style = {
    
    make_attribute_function : function(a, obj){
        
        var out = null;
        for(var o in obj.options){
            if(a === obj.options[o].field_value){
                out = obj.options[o].attribute_value;
            }
        }
        return out;
    },
    
    make_style_function : function(o, s){
        /*
         F = the retunred function
         f is the feature sent to the function via leaflet
         o = is the style_schema object
         
         What is happening here is the object that is returned from calling the 
         Function F is being created. It uses the features.properties and the 
         specific attriute (o[a].field_name ) from style_schema and sends the 
         object for that attribute (o[a]) with it.
        */
        
        //TODO this is great for simple attribute = value.
        //we need to have some options for ranges and more complex options
        var F = function(f){
            var options = {};    
            for(var a in o){
                options[a] = 
                    ML3.Style.make_attribute_function(
                        f.properties[o[a].field_name], o[a]);
            }
            for(var b in s){
                options[b] = s[b];
            }
            return options;
        };
        
        return F;
    },
    
    //TODO this needs to be clean up quite a bit but it does seem to be a great
    //start. Needs to finish point and make it make more logical sense
    //and then enable the ability to have a style based on multiple attributes
    
    make_style : function(layerInfo){
        try {
            if(layerInfo.options.options.style.generateStyle){
                if(layerInfo.options.options.style.marker){
                        
                        layerInfo.options.options.pointToLayer = 
                        function (feature, latlng){
                            var myIcon = L.icon({ 
                                iconUrl: '/symbols/xformer.svg',
                                iconSize: [22, 22]
                            });
                            marker = L.marker([latlng.lat, latlng.lng], {icon: myIcon});
                            return marker;
                        }  
                        
                } else {
                    var oStyle = layerInfo.options.options.style;
                    var style_schema = layerInfo.options.options.style_schema;
                
                    var s = {};
                    for(var c in oStyle){
                        if(c != 'generateStyle'){
                            s[c] = oStyle[c];
                        }
                    }
                    layerInfo.options.options.style = 
                        ML3.Style.make_style_function(style_schema, s);
                
                    //If it is a point something else needs to be done
                    if(layerInfo.options.feature_type === 'point'){
                    
                        layerInfo.options.options.pointToLayer = 
                            function (feature, latlng) {
                                return L.circleMarker(latlng, layerInfo.options.options.style);
                        };
                    }
                }
            }
        } catch(e){}
    
        return layerInfo;
    }
}