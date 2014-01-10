openerp.unleashed.module('web_responsive').ready(function(instance, responsive, _, Backbone, base){

    var Unleashed = base.views('Unleashed');

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
        },

        bind: function(){
            this.module.on('item:open', this.openItem, this);
        },

        openItem: function(item){
            this.dataset.unleashed.model = item;
            this.do_switch_view('form');
        },

        createItem: function(){
            this.dataset.unleashed.model = this.getNewModel();
            this.do_switch_view('form');
        },

        getNewModel: function(){
            var Model = base.models('BaseModel'),
                DataModel = Model.extend({
                    model_name: this.dataset.model
                });
            return new DataModel();
        },

        configure: function () {

            this.bind();

            var Pager = base.views('Pager'),
                List = this.module.views('List'),
                Collection = base.collections('Pager');

            var DataCollection = Collection.extend({
                model_name: this.dataset.model,
                model: base.models('BaseModel')
            });
            this.collection = new DataCollection();

            // set the collection in dataset, shared between views
            this.dataset.unleashed = {
                collection: this.collection,
                model: this.getNewModel()
            };

            this.pager = new Pager({
                collection: this.collection
            });

            this.view = new List({
                collection: this.collection,
                template: this.arch.get('tree.mobile.item-template', 'ResponsiveItem')
            });


        },

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
        }
    });
});