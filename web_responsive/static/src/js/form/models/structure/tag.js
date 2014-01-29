openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Model = base.models('BaseModel');

    var Tag = Model.extend({

        type: 'none',

        initialize: function(data, options){
            this.set('type', this.type, {silent: true});
            this.model = options.model;
            this.mode = options.mode;
            this.ready = $.when();
        },

        bind: function(){},

        unbind: function(){},

        setModel: function(model){
            this.model = model;
            this.trigger('define:model', model);
        },

        setMode: function(mode){
            this.mode = mode;
            this.trigger('define:mode', mode);
        }
    });

    responsive.models('Tag', Tag);
});


