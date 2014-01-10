openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){
    
    var State = base.models('State');

    var FormState = State.extend({
        
        defaults: {
            'model_id': null,
            'mode': 'edit'
        },

        link: function(options){
            this.model = options.model;
            if(options.id){
                this.set({
                    model_id: options.id,
                    mode: 'view'
                });
            }
        },

        bind: function(){
            this.model.on('change:id', this.modelChanged, this);
        },

        modelChanged: function(){
            this.set('model_id', this.model.get('id'));
        },

        configModel: function(){
            var model_id = this.get('model_id'),
                promise = null;
            if(model_id){
                promise = this.model.set('id', model_id).fetch();
            };
            return promise;
        },

        process: function(){
            return $.when(this.configModel());
        }
    });

    responsive.models('State', FormState);
});