openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Separator = responsive.models('Tag').extend({
        type: 'separator'
    });

    responsive.models('Separator', Separator);
});


