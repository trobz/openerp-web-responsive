openerp.unleashed.module('web_responsive', function(responsive, _, Backbone){

    var ItemView = Backbone.Marionette.ItemView;

    var Item = ItemView.extend({
        tagName: 'li',
        template: "Effimax.WidgetMany2ManyCompletion.popin.item",

        events: {
            'click': 'toggleSelection'
        },

        toggleSelection: function(e){
            if(e) e.preventDefault();
            this.model.toggle();
        },

        serializeData: function(){
            return {
                title: this.model.title(),
                selected: this.model.get('selected')
            };
        }
    });

    responsive.views('Item', Item);
});