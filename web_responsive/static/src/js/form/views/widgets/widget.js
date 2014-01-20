openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Widget = Backbone.Marionette.ItemView.extend({
        template: 'Base.Empty',

        initialize: function(options){
            this.field = this.model;
            this.modifiers = this.field.get('modifiers') || {};
        },

        bind: function(){
            this.model = this.field.model;
            this.field_name = this.field.get('name');
            this.listenTo(this.model, 'change:' + this.field_name, this.refresh);
        },

        unbind: function(){
            this.stopListening();
        },

        value: function(value){
            // add a check if value != current value
            // has to check for array because OpenERP return many2one field as a [id, name] array...
            var current = this.model.get(this.field_name);
            current = _.isArray(current) && current.length > 1 ? current[0] : current;

            if(value && value != current){
                this.model.set(this.field_name, _.parse(value));
            }
            return this.model.get(this.field_name);
        },

        refresh: function(){
            this.render();
        },

        onBeforeRender: function(){
            this.bind();
            this.listenTo(this.field, 'define:model', this.bind);
            this.field.bind();
        },

        onClose: function(){
            this.unbind();
            this.field.unbind();
        }
    });

    responsive.views('Widget', Widget);
});