openerp.unleashed.module('responsive', function(responsive, _, Backbone){

    var ItemCollection = responsive.collections('Items');

    var ItemView = Backbone.Marionette.ItemView;

    var Completion = responsive.views('Completion');

    var Many2ManyCompletion = ItemView.extend({

        className: 'many2many-completion',
        template: 'Effimax.WidgetMany2ManyCompletion.field',

        events: {
            'click': 'openCompletion'
        },

        ui: {
            input: 'input'
        },

        collectionEvents: {
            'change:selected': 'render',
            'reset': 'render'
        },

        initialize: function(options){
            this.displayer = options.displayer;
            this.search = options.search;
            this.isOpen = false;
            this.unique = options.unique;
            this.selected = [];

            this.getSelected();
            this.ready = this.setCollection();

            this.listenTo(responsive, 'widget:open', function(widget){
                if(widget.cid != this.cid && this.isOpen){
                    this.cancel();
                }
            });
        },

        changeDomain: function(domain){
            this.model.set('domain', domain);
            return this.refreshCollection();
        },

        getSelected: function(){
            var domain = this.search.get('domain'),
                ids = [],
                model = this.model;

            _(domain).each(function(criterion){
                if(
                    _.size(criterion) >= 3 &&
                    criterion.field.get('reference') == model.get('reference') &&
                    criterion.operator == 'in'
                ){
                    ids = criterion.value;
                }
            });

            this.setSelected(ids);
        },

        setSelected: function(ids){
            this.selected = ids;
            //FIXME: Other component has to know if something is selected for specific filter...
            //FIXME: dirty way to do it, set it globally :(
            responsive.selected = responsive.selected || {};

            var selection = this.collection ? this.collection.selection().ids() : [],
                selected_ids = _.intersection(this.selected, selection);

            responsive.selected[this.model.get('reference')] = selected_ids;
        },

        setCollection: function(){
            var desc = this.model.get('field_description');
            if(!desc || !('relation' in desc)){
                throw new Error('no model in relation');
            }

            var Items = ItemCollection.extend({
                model_name: desc['relation']
            });

            this.collection = new Items([], {
                selected: this.selected,
                query: this.query(),
                unique: this.unique
            });
            return this.updateCollection();
        },

        refreshCollection: function(){
            this.collection.resetSelection();
            return this.updateCollection();
        },

        updateCollection: function(){
            var def = $.Deferred();

            var promise = this.collection.fetch(this.query());
            promise.done(function(){
                this.collection.initSelection(this.selected);

                if(this.unique && !this.collection.hasSelection()){
                    this.collection.selectFirst();
                }

                this.setSelected(this.collection.selection().ids());

                def.resolve();
            }.bind(this));

            promise.fail(function(){
                def.reject();
            });

            return def.promise();
        },

        query: function(){
            return {
                filter: this.model.get('domain') || [],
                limit: 10
            };
        },

        resetSelection: function(){
            this.collection.resetSelection();
            this.collection.initSelection(this.selected);
        },

        openCompletion: function(e){
            if(e) e.preventDefault();

            if(!this.isOpen){
                responsive.trigger('widget:open', this);
                this.isOpen = true;

                var completion = this.completion = new Completion({
                    collection: this.collection,
                    domain: this.model.get('domain') || [],
                    $el: this.$el
                });

                this.displayer.show(completion);

                this.listenTo(completion, 'cancel', this.cancel);
                this.listenTo(completion, 'validate', this.validate);

                completion.ui.input.get(0).select();
            }
            else {
                this.close();
            }

        },

        cancel: function(){
            this.resetSelection();
            this.close();
        },

        close: function(){
            responsive.trigger('widget:close', this);
            this.isOpen = false;
            if(this.completion) {
                this.stopListening(this.completion);
            }
            this.displayer.close();
        },


        validate: function(){
            this.setSelected(this.collection.selection().ids());
            this.trigger('change', this.selected);
            this.close();
        },


        serializeData: function(){
            return {
                label: this.model.get('name'),
                name: this.model.get('reference'),
                value: this.getDisplayValue()
            }
        },

        getDisplayValue: function(){
            var value = this.model.get('name'),
                selection = this.collection.selection();

            if(selection.length == 1){
                value = (this.model.get('name') + ': ' + selection.at(0).get('name'));
            }
            else if(selection.length > 1){
                value = (this.model.get('name') + ': ' + selection.length + ' records');
            }
            return value;
        }
    });

    responsive.views('Many2OneCompletion', Many2OneCompletion);

});