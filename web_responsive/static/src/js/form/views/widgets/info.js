openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    /*
     * Item View for each info > field tag
     */
    var Widget = responsive.views('Widget');

    var Item = Widget.extend({

        tagName: 'li',

        template: 'ResponsiveForm.Widget.Info.Item',

        events: {
            'tap': 'displayHelp'
        },

        displayHelp: function(e){
            var $el = this.$el;
            $el.tooltip('show');
            setTimeout(function(){
                $el.tooltip('hide');
            }, 2000);
        },

        onRender: function(){
            this.$el.tooltip({
                title: this.field.get('field_description'),
                placement: 'bottom'
            });
        },

        serializeData: function(){
            return {
                value: this.model.get(this.field_name),
                name: this.field.get('string') || this.field.get('field_description')
            };
        }
    });

    /*
     * Composite View used to display info > field tag
     */

    var CompositeView = Backbone.Marionette.CompositeView,
        _super = CompositeView.prototype;

    var Info = CompositeView.extend({

        className: 'info-panel',

        template: 'ResponsiveForm.Widget.Info',

        itemView: Item,

        itemViewContainer: 'ul',

        initialize: function(options){
            this.collection = this.model.collection;
            _super.initialize.apply(this, arguments);
        },

        attachElement: function(){
            //FIXME: should have a better way to access to the footer in a subview
            this.$el.detach().appendTo($('.view_manager_head'));
        },

        onShow: function(){
            this.attachElement();
        }
    });

    responsive.views('Info', Info);
});


