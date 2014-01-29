openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var BaseModel = base.models('BaseModel');

    var Item = BaseModel.extend({

        defaults: function(){
            return {
                selected: false
            };
        },

        toggle: function(options){
            if(this.get('selected')){
                this.unselect(options);
            }
            else {
                this.select(options);
            }
        },

        select: function(options){
            if(this.collection.unique){
                this.collection.resetSelection();
            }
            this.set('selected', true, options);
        },

        unselect: function(options){
            options = options || {};
            if(this.collection.unique){
                this.collection.resetSelection();
                this.collection.selectFirst();
            }
            else {
                this.set('selected', false, options);
            }
        },

        title: function(){
            //TODO: specific code for iman should be defined outside...
            var title = '<span class="title">' + this.get('name') + '</span>';
            if(this.collection.model_name == 'iman'){
                title = '<span class="title iman-name">' + this.get('name') + '</span> <span class="iman-desc">' + this.get('description') + '</span>';
            }

            return title;
        }
    });

    responsive.models('Item', Item);
});