openerp.unleashed.module('web_responsive').ready(function(instance, responsive, _, Backbone, base){

    var Unleashed = base.views('Unleashed');
    var DataModel = responsive.models('Data');

    /*
     * for mobile, use a Marionette layout instead of the OpenERP Form,
     * FormView is just used to wrap the mobile version
     */
    instance.web.FormView = Unleashed.extend({
        template: 'ResponsiveForm',
        searchable: false,
        display_name: base._lt('Form'),
        view_type: 'form',

        module: responsive,

        events: {
            'submit': 'submit'
        },

        State: responsive.models('FormState'),


        /*
         * Button actions
         */

        back: function(model){
            this.model.rollback({silent: true});
            this.do_switch_view('list');
        },

        cancel: function(){
            this.model.rollback({silent: true});
            this.switch_mode('view');
        },

        edit: function(model){
            this.model.commit();
            this.switch_mode('edit');
        },

        save: function(model){
            this.$el.submit();
        },

        submit: function(e){
            if(e) e.preventDefault();

            if(this.$el.valid()){

                this.model.save({
                    success: function(){
                        this.switch_mode('view');
                    }.bind(this)
                });
            }
        },

        /*
         *  Configure
         */

        configure: function(){
            // avoid error in inherited OpenERP view...
            this.datarecord = { id: null };
            // used to know if the instance is reused or has been initialized
            this.reuse = false;
        },

        stateConfig: function(){
            var Model = DataModel.extend({
                model_name: this.dataset.model
            });

            this.model = new Model();

            this.state.link({
                dataset: this.dataset,
                model: this.model
            });
        },

        /*
         * Render
         */


        ready: function (data) {
            this.renderForm(data);
            this.renderButtons(data);
        },

        renderForm: function(data){
            var Form = this.module.views('Form');

            this.view = new Form({
                mode: this.state.get('mode'),
                model: this.model,
                arch: data.arch,
                form: this.$el
            });
        },

        renderButtons: function(data){
            var Buttons = this.module.views('Buttons');

            var buttons =  this.state.get('mode') == 'view' ?
                [
                    Buttons.BackButton.extend({action: this.back.bind(this) }),
                    Buttons.EditButton.extend({action: this.edit.bind(this) })
                ]
                :
                [
                    Buttons.BackButton.extend({action: this.back.bind(this) }),
                    Buttons.SaveButton.extend({action: this.save.bind(this) }),
                    Buttons.CancelButton.extend({action: this.cancel.bind(this) })
                ];

            this.buttons = new Buttons({
                model: this.model,
                buttons: buttons
            });
        },

        switch_mode: function(mode){
            if(this.state.get('mode') != mode){
                this.state.set('mode', mode);
                this.refresh();
                this.view.render();
            }
        },

        refresh: function(){
            // recreate button instance and inject them
            this.renderButtons();
            this.panel.buttons.show(this.buttons);
            // we just want to render the new model,
            // not recreating all the structure
            this.view.setMode(this.state.get('mode'));
            this.view.setModel(this.model);
        },

        do_show: function(){
            var _super = this._super;
            $.when(
                this.reuse ? this.stateInit() : null
            )
            .done(function(){
                if(this.reuse){
                    this.bindView();
                    this.stateChanged();
                }
                this.reuse = true;
                this.refresh();
                this.panel.body.show(this.view);
                _super.apply(this, arguments);
            }.bind(this));
        },

        do_hide: function(){
            this.unbindView();
            this.panel.body.close();
            this.panel.buttons.close();
            return this._super.apply(this, arguments);
        },

        do_switch_view: function(type){
            this.state.set('view_type', type);
            return this._super.apply(this, arguments);
        },

        close: function(){
            this.state.clear();
            this.view.off();
            return this._super.apply(this, arguments);
        },

        /*
         * we don't need arch interpretation, arch is not use as a configuration
         * on mobile form view
         */
        extractArch: function(arch){},

        /*
         * specific methods called by the view manager
         */
        can_be_discarded: function(){
            return true;
        }
    });
});