openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){
    
    var State = base.models('State');

    var FormState = State.extend({
        
        defaults: {
            'model_id': null,
            'mode': 'view',
            'view_type': 'form'
        },

        link: function(options){
            this.model = options.model;
            // advantage to dataset model info over url parameters
            if(options.dataset.ids.length > 0){
                this.set('model_id', options.dataset.ids[0], {
                    silent: true
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
            var model_id = this.get('model_id');
            return $.when(
                _.isNumber(model_id) ?
                    this.model.isNew() ? this.model.set('id', model_id).fetch() : null
                : null
            );
        },

        configMode: function(){
            var mode = this.get('mode');
            this.set({
                mode: this.model.isNew() ? 'edit' : mode
            });
        },

        process: function(){
            return $.when(
                this.configModel()
            ).then(function(){
                this.configMode()
                }.bind(this));
        }
    });

    responsive.models('FormState', FormState);
});