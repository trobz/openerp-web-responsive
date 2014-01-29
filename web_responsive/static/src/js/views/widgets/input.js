openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Input = Backbone.Marionette.ItemView.extend({
        className: 'form-group',
        template: 'ResponsiveForm.Widget.Input',

        initialize: function(options){
            this.field = this.model;
            this.model = this.model.model;
        },

        events: {
            'message:error': 'displayTooltip'
        },

        ui: {
            input: 'input'
        },

        displayTooltip: function(e, message){
            this.ui.input.attr('error-message', message);
            var $tooltip = this.$el.find('.tooltip'),
                has_message = message && message.length > 0,
                opacity = parseFloat($tooltip.css('opacity') || 0);


            if(has_message && opacity <= 0){
                this.ui.input.tooltip('show');
                setTimeout(function($input){
                    $input.tooltip('hide');
                }, 2000, this.ui.input);
            }
            else if(has_message){
                $tooltip.css('opacity', 1);
            }
            else {
                this.ui.input.tooltip('hide');
            }
        },

        onRender: function(){
            /* on screen < 768, display right side*/
            var placement = Modernizr.mq('(max-width:767px)') ? 'right' : 'left',
                $input = this.ui.input;

            // define a tooltip used at validation
            $input.tooltip({
                title: function(){
                    return $input.attr('error-message');
                },
                placement: placement,
                container: this.$el
            });
        },

        serializeData: function(){
            return _.extend(this.field.toJSON(), {
                input_type: this.field.inputType(),
                type: this.field.get('ttype'),
                mode: this.field.mode,
                value: this.model.get(this.field.get('name'))
            });
        }
    });

    responsive.views('Input', Input);
});


