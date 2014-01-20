openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Collection = base.collections('Pager');

    var DataCollection = Collection.extend({

    });

    responsive.collections('Data', DataCollection);
});


