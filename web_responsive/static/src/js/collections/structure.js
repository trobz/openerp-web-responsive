openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Collection = Backbone.Collection;

    var Structure = Collection.extend({
        tags: {
            'separator': responsive.models('Separator'),
            'field': responsive.models('Field')
        },

        constructor: function(options){
            this.mobile = this.getMobileData(options.description);
            this.model = options.model;
            this.mode = options.mode;

            Collection.apply(this, [this.build(), options]);
        },

        ready: function(){
            var promises = [];
            this.each(function(model){
                promises.push(model.ready);
            });
            return $.when.apply($, promises);
        },

        /*
         * process mobile arch description and convert it into an
         * ordered flat collection of items
         */
        build: function(){
            var data = [], tags = this.tags, model = this.model, mode = this.mode;
            _(this.mobile).each(function(item){
                if(item.tag in tags){
                    data.push(
                        new tags[item.tag](
                            item.attrs,
                            { model: model, mode: mode }
                        )
                    );
                }
                else {
                    console.warn(item.tag, 'is not supported for mobile form view, check your form view arch.')
                }
            });
            return data;
        },

        getMobileData: function(data){
            var mobile;
            if(!data || data.tag != 'form' || data.children.length <= 0){
                throw new Error('Form view arch seems wrong');
            }

            mobile = _(data.children)
                .chain()
                .find(function(child){
                    return child.tag = 'mobile';
                })
                .value().children;

            if(!mobile){
                throw new Error('cannot find "mobile" tag in form view arch');
            }

            return mobile;
        }
    });

    responsive.collections('Structure', Structure);
});


