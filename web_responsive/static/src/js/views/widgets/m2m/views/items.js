openerp.unleashed.module('web_responsive', function(responsive, _, Backbone){

    var Items = Backbone.Marionette.CollectionView.extend({
        tagName: 'ul',

        collectionEvents: {
            'change:selected': 'render'
        },

        initialize: function(options){
            this.options = options;
        }
    });

    responsive.views('Items', Items);
});