openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Widget = responsive.views('Widget'),
        _super = Widget.prototype;

    var Separator = Widget.extend({
        tagName: 'h3',

        template: 'ResponsiveForm.Widget.Separator',

        serializeData: function(){
            return this.field.toJSON();
        }
    });

    responsive.views('Separator', Separator);
});


