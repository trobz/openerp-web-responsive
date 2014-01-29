openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Model = base.models('BaseModel');

    var Field = Model.extend({

        model_name: 'ir.model.fields',

        initialize: function(data, options){
            this.model = options.model;
            this.mode = options.mode;

            this.parseAttributes();
            this.ready = this.fetch();
        },

        inputType: function(){
            var type = 'text';
            switch (this.get('ttype')) {
                case 'date':
                    type = 'date';
                    break;
                case 'datetime':
                    type = 'datetime';
                    break;
                case 'time':
                    type = 'time';
                    break;
                case 'integer':
                    type = 'number';
                    break;
            }
            return type;
        },

        parseAttributes: function(){
            var attrs = this.attributes,
                yes = /^true$/i, no = /^false$/i;

            _(attrs).each(function(value, name){
                value = yes.test(value) ? true : value;
                value = no.test(value) ? false : value;

                try {
                    attrs[name] = JSON.parse(value);
                }
                catch(e){
                    attrs[name] = value;
                }
            });
        },

        fetch: function(query){
            return Backbone.Model.prototype.fetch.apply(this, [this.search(query)]);
        },

        search: function(query){
            query = query || {};

            var filter = query.filter || [];
            filter.push(
                ['model', '=', this.model.model_name],
                ['name', '=', this.get('name')]
            );

            return _.extend({
                filter: filter,
                type: 'first'
            }, query);
        }
    });

    responsive.models('Field', Field);
});


