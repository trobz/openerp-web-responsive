openerp.unleashed.module('web_responsive').ready(function(instance, responsive, _, Backbone, base){

    var Unleashed = base.views('Unleashed');
    var DataCollection = responsive.collections('Data');

    /*
     * for mobile, use a Marionette simple list instead of the OpenERP List,
     * ListView is just used to wrap the mobile version
     */
    instance.web.ListView = Unleashed.extend({
        template: 'ResponsiveList',

        view_type: 'tree',

        module: responsive,

        init: function(){
            // fake fields_view to avoid error with "ViewManagerDebug" template,
            // don't ask me why...
            this.fields_view = { view_id: '42' };

            this._super.apply(this, arguments);

            this.Collection = DataCollection.extend({
                model_name: this.dataset.model,
                model: responsive.models('Data')
            });
        },

        bind: function(){
            this.module.on('item:open', this.openItem, this);
        },

        /*
         * Buttons actions
         */

        openItem: function(item){
            this.dataset.alter_ids([item.get('id')]);
            this.do_switch_view('form');
        },

        createItem: function(){
            this.dataset.alter_ids([]);
            this.do_switch_view('form');
        },

        /*
         * Configuration
         */


        configure: function(){
            this.bind();

            var Pager = base.views('Pager'),
                List = this.module.views('List');

            this.collection = new this.Collection();

            this.pager = new Pager({
                collection: this.collection
            });

            this.view = new List({
                collection: this.collection,
                template: this.arch.get('tree.mobile.item-template', 'ResponsiveItem')
            });
        },

        stateConfig: function(){
            // force the view_type (seems OpenERP is not ok to do it by himself...)
            this.state.unset('model_id');
            this.state.unset('mode');
            this.state.get('view_type', 'list');
        },

        /*
         * Render
         */

        renderButtons: function(){
            var Buttons = this.module.views('Buttons');

            this.buttons = new Buttons({
                buttons: [
                    Buttons.CreateButton.extend({ action: _(this.createItem).bind(this) })
                ]
            });

            this.panel.buttons.show(this.buttons);
        },

        ready: function (data) {
            this.pager.$el.hide();
            this.view.$el.hide();

            this.renderButtons();
            this.panel.pager.show(this.pager);
            this.panel.body.show(this.view);
        },

        do_show: function(){
            this.stateConfig();
            this.stateChanged();
            this.renderButtons();
            return this._super.apply(this, arguments);
        },

        do_search: function(domain, context){
            this.collection.load({
                filter: domain,
                context: context,
                persistent: true
            })
            .done(_.bind(function(){
                this.pager.$el.show();
                this.view.$el.show();
            }, this));
        },

        do_switch_view: function(type){
            this.state.set('view_type', type);
            return this._super.apply(this, arguments);
        }
    });
});