openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Separator = Backbone.Model.extend({

        initialize: function(){
            this.set('type', 'separator', {silent: true});
            this.ready = $.when();
        }

    });

    responsive.models('Separator', Separator);
});


