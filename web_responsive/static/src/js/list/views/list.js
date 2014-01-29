openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Item = Backbone.Marionette.ItemView.extend({
        tagName: 'li',
        className: 'list-group-item',

        events: {
            'tap': 'open'
        },

        initialize: function(options){
            this.options = options;
        },

        open: function(){
            // use a module event, cause listening to event on OpenERP view style
            // seems dangerous to me...
            responsive.trigger('item:open', this.model);
        },

        serializeData: function(){
            return this.model.toJSON(null, {
                local: true,
                keep_array: true
            });
        }
    });

    var List = Backbone.Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'list-group',
        itemView: Item,

        itemViewOptions: function(){
            return {
                template: this.template
            }
        },

        initialize: function(options){
            this.template = options.template;
        },

        onRender: function(){
            responsive.trigger('view:rendered', this);
        }
    });

    responsive.views('List', List);
});


