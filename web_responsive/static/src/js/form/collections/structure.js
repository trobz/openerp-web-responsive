openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Collection = Backbone.Collection;

    var Structure = Collection.extend({
        tags: {
            'separator': responsive.models('Separator'),
            'field': responsive.models('Field'),
            'info': responsive.models('Info')
        },


        initialize: function(data, options){
            this.mobile = this.getMobileData(options.description);
            this.model = options.model;
            this.mode = options.mode;
        },

        populate: function(){
            this.add(this.build());
            return this.ready();
        },

        applyDomain: function(data){
            var field_names = _(data).map(function(value, key){
                return key;
            });

            _(this.fields(field_names)).each(function(field){
                var name = field.get('name');
                console.log('apply domain', name, data[name]);
                field.set('domain', data[name])
            });
        },

        ready: function(){
            var promises = [];
            this.each(function(model){
                promises.push(model.ready);
            });
            return $.when.apply($, promises);
        },

        fields: function(names){
            return this.filter(function(tag){
                    return tag instanceof this.tags['field'] && ( !names || _(names).contains(tag.get('name')));
                }, this);
        },

        fieldNames: function(){
            return _(this.fields()).map(function(field){
                return field.get('name');
            });
        },

        /*
         * process mobile arch description and convert it into an
         * ordered collection of tags object
         */
        build: function(){
            var structure = [], tags = this.tags, model = this.model, mode = this.mode;

            var recursive_build = function(items, data){
                _(items).each(function(item){
                    var component;

                    if(item.tag in tags){
                        component = new tags[item.tag](
                            item.attrs,
                            { model: model, mode: mode }
                        );
                        data.push(component);
                    }
                    else {
                        console.warn(item.tag, 'is not supported for mobile form view, check your form view arch.')
                    }
                    if(component && item.children && item.children.length > 0){
                        recursive_build(item.children, component);
                    }
                });
            };

            recursive_build(this.mobile, structure);

            return structure;
        },

        getMobileData: function(data){
            var mobile;
            if(!data || data.tag != 'form' || data.children.length <= 0){
                throw new Error('Form view arch seems wrong');
            }

            var mobile_tag = _(data.children).find(function(child){
                return child.tag == 'mobile';
            });

            mobile = mobile_tag && mobile_tag.children ? mobile_tag.children : null;

            if(!mobile){
                console.warn('cannot find "mobile" tag in form view arch');
            }

            return mobile || data.children;
        }
    });

    responsive.collections('Structure', Structure);
});


