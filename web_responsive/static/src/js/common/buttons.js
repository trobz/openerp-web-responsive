openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    //<button type="button" t-att-class="'btn btn-' + type">

    var Button = Backbone.Marionette.ItemView.extend({

        template: 'Responsive.Button',
        tagName: 'button',
        className: 'btn btn-sm',
        icon: '',
        label: '',
        type: 'default', // bootstrap button class name, without "btn-" prefix
        align: 'left',

        events: {
            'tap': 'doAction',
            'focus': 'preventDefault'
        },



        initialize: function(options){
            this.collection = options.collection;
            this.model = options.model;
            this.label = base._lt(this.label);
        },

        onRender: function(){
            this.$el
                .attr('type', 'button')
                .addClass('btn-' + this.type)
                .addClass('align-' + this.align);
        },

        doAction: function(){
            var args = [];
            if(this.model){
                args.push(this.model);
            }
            if(this.collection){
                args.push(this.collection);
            }
            args.concat(_.toArray(arguments));

            this.action.apply(this, args);
        },


        preventDefault: function(e){
            if(e) e.preventDefault();
            return false;
        },

        action: function(){
            console.log('action', arguments);
        },

        serializeData: function(){
            return {
                label: this.label,
                icon: this.icon,
                type: this.type
            };
        }
    });


    var BackButton = Button.extend({
        icon: 'icon-back',
        label: 'Back'
    });

    var SaveButton = Button.extend({
        icon: 'icon-save',
        label: 'Save',
        type: 'success'
    });

    var EditButton = Button.extend({
        icon: 'icon-edit',
        label: 'Edit',
        type: 'primary'
    });

    var CreateButton = Button.extend({
        icon: 'icon-create',
        label: 'Create',
        type: 'primary'
    });

    var CancelButton = Button.extend({
        icon: 'icon-cancel',
        label: 'Cancel',
        type: 'warning'
    });

    var NextButton = Button.extend({
        icon: 'icon-next',
        label: 'Next',
        type: 'primary',
        align: 'right'
    });

    var Collection = Backbone.Marionette.CollectionView;

    var Buttons = Collection.extend({

        itemViewOptions: function(){
            return {
                model: this.model,
                collection: this.collection
            };
        },

        initialize: function(options){
            this.model = options.model || null;
            this.collection = options.collection || null;
            this.buttons = options.buttons || [];
        },

        // FIXME: should never override _method
        _renderChildren: function () {
            this.closeEmptyView();
            this.closeChildren();
            this.showCollection();
        },

        showCollection: function(){
            _(this.buttons).each(function(view, index){
                this.addItemView(this.model, view, index);
            }, this);
        }
    }, {
        // static declaration of button types
        Button: Button,
        CreateButton: CreateButton,
        EditButton: EditButton,
        SaveButton: SaveButton,
        CancelButton: CancelButton,
        BackButton: BackButton,
        NextButton: NextButton
    });

    responsive.views('Buttons', Buttons);
});