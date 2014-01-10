openerp.unleashed.module('web_responsive').ready(function(instance, responsive, _, Backbone, base){

    var Unleashed = base.views('Unleashed');

    /*
     * for mobile, use a Marionette layout instead of the OpenERP Form,
     * FormView is just used to wrap the mobile version
     */
    instance.web.FormView = Unleashed.extend({
        template: 'ResponsiveForm',
        searchable: false,
        display_name: base._lt('Form'),
        view_type: 'form',

        State: responsive.models('State'),

        module: responsive,

        events: {
            'submit': 'submit'
        },

        init: function(){
            this._super.apply(this, arguments);
        },

        back: function(model){
            this.do_switch_view('list');
        },

        cancel: function(){
            this.switch_mode('view');
        },

        edit: function(model){
            this.switch_mode('edit');
        },

        save: function(model){
            this.$el.submit();
        },

        submit: function(e){
            if(e) e.preventDefault();

            // update model with form data
            console.log('submit', arguments);

//            model.save().done(function(){
//                this.switch_mode('view');
//            }.bind(this));
        },

        configure: function(){
            this.model = this.dataset.unleashed.model;
            this.collection = this.dataset.unleashed.collection;
            this.mode = this.collection.get(this.model) ? 'view' : 'edit';

            // avoid errors on OpenERP ViewManager
            this.datarecord = { id: null };
        },


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

            this.panel.body.show(this.view);
        },

        renderButtons: function(data){
            var Buttons = this.module.views('Buttons');

            var buttons =  this.mode == 'view' ?
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
            this.panel.buttons.show(this.buttons);
        },

        switch_mode: function(mode){
            this.mode = mode;
            this.refresh();
        },

        refresh: function(){
            // recreate button instance and inject them
            this.renderButtons();
            // we just want to render the new model,
            // not recreating all the structure
            this.view.setMode(this.mode);
            this.view.setModel(this.model);
            this.view.render();
        },

        do_show: function(){
            this.configure();
            this.refresh();
            return this._super.apply(this, arguments);
        },

        do_hide: function(){
            this.state.clear();
            return this._super.apply(this, arguments);
        },

        close: function(){
            this.state.clear();
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