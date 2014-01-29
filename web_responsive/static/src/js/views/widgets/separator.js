openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Separator = Backbone.Marionette.ItemView.extend({
        tagName: 'h3',

        template: 'ResponsiveForm.Widget.Separator'
    });

    responsive.views('Separator', Separator);
});


