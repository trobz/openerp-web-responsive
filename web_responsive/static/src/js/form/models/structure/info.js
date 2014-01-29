openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Tag = responsive.models('Tag'),
        _super = Tag.prototype;

    var Info = Tag.extend({
        type: 'info',


        initialize: function(data, options){
            this.collection = new Backbone.Collection();
            return _super.initialize.apply(this, arguments);
        },

        setModel: function(model){
            this.collection.each(function(field){
                field.setModel(model);
            });
            return _super.setModel.apply(this, arguments);
        },

        push: function(){
            this.collection.add.apply(this.collection, arguments);
        }
    });

    responsive.models('Info', Info);
});


