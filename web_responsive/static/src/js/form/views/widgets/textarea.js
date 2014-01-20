openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){


    var Input = responsive.views('Input'),
        _super = Input.prototype;

    var Textarea = Input.extend({
        template: 'ResponsiveForm.Widget.Textarea',

        events: {
            'message:error': 'displayTooltip',
            'change textarea': 'onChange'
        },

        ui: {
            input: 'textarea'
        },

        serializeData: function(){
            var modifiers = this.field.get('modifiers') || {},
                value = this.value();

            return _.extend(this.field.toJSON(), {
                input_type: this.field.inputType(),
                type: this.field.get('type'),
                mode: modifiers.readonly ? 'view' : this.field.mode,
                modifiers: modifiers,
                value: value,
                text: _.isBoolean(value) ? '' : value
            });
        }
    });

    responsive.views('Textarea', Textarea);
});