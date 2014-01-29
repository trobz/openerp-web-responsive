openerp.unleashed.module('web_responsive', function(responsive, _, Backbone){

    var ItemView = Backbone.Marionette.ItemView;

    var Select = ItemView.extend({
        tagName: 'li',
        template: "Effimax.WidgetMany2ManyCompletion.popin.select",

        events: {
            'click': 'removeSelection'
        },

        removeSelection: function(e){
            if(e) e.preventDefault();
            this.model.unselect();
        },


        serializeData: function(){
            return {
                title: this.model.title(),
                selected: this.model.get('selected')
            };
        }
    });

    responsive.views('Select', Select);
});