openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Widget = responsive.views('Widget'),
        _super = Widget.prototype;

    var Input = Widget.extend({

        className: 'form-group',
        template: 'ResponsiveForm.Widget.Input',

        events: {
            'message:error': 'displayTooltip',
            'change input': 'onChange'
        },

        ui: {
            input: 'input'
        },

        displayTooltip: function(e, message){
            var $input = this.ui.input,
                $tooltip = this.$el.find('.tooltip'),
                has_message = message && message.length > 0,
                opacity = parseFloat($tooltip.css('opacity') || 0);

            $input.attr('error-message', message);

            if(has_message && opacity <= 0){
                $input.tooltip('show');
                setTimeout(function(){
                    $input.tooltip('hide');
                }, 2000);
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
            var placement = Modernizr.mq('(max-width:767px)') ? 'top' : 'left',
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

        onChange: function(){
            this.value(this.ui.input.val());
        },

        serializeData: function(data){
            var modifiers = this.field.get('modifiers') || {};

            return _.extend(this.field.toJSON(), {
                input_type: this.field.inputType(),
                type: this.field.get('type'),
                mode: modifiers.readonly ? 'view' : this.field.mode,
                modifiers: modifiers,
                value: this.value(),
                text: this.value()
            });
        }
    });

    responsive.views('Input', Input);
});