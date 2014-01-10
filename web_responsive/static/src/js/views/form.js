openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Collection = Backbone.Marionette.CollectionView;
        _super = Collection.prototype;

    var Form = Collection.extend({

        views: {
            'separator': responsive.views('Separator'),
            'default': responsive.views('Input'),
            'char': responsive.views('Input'),
            'date': responsive.views('Input'),
            'datetime': responsive.views('Input'),
            'integer': responsive.views('Input'),
            'many2one': responsive.views('Input')
        },


        initialize: function(options){
            var Structure = responsive.collections('Structure');
            this.$form = options.form;

            this.collection = new Structure({
                description: options.arch,
                mode: options.mode,
                model: this.model
            });

            this.configValidation();
        },

        configValidation: function(){

            jQuery.validator.setDefaults({

                // use a tooltip instead
                errorPlacement: function(){},

                highlight: function (element) {
                    var $element = $(element),
                        $parent = $element.closest('.form-group')
                        error_msg  = '';

                    // FIXME: get element error message, they should be a better way...
                    _(this.errorList).each(function(error){
                        if(error.element == element){
                            error_msg = error.message;
                        }
                    });

                    // message is only trigged, displaying is managed by the element itself
                    $element.trigger('message:error', error_msg);
                    $parent.addClass('has-error').removeClass('has-success');
                },

                unhighlight: function (element) {
                    var $element = $(element),
                        $parent = $element.closest('.form-group');

                    $element.trigger('message:error', '');
                    $parent.removeClass('has-error');
                },

                success: function(success, element){
                    var $element = $(element),
                        $parent = $element.closest('.form-group');

                    $element.trigger('message:error', '');
                    $parent.removeClass('has-error').addClass('has-success');
                }
            });
        },

        setValidation: function(){
            var rules = {}, rule, modifiers;

            this.collection.each(function(field){
                rule = rules[field.get('name')] = {};
                type = field.get('ttype');
                modifiers = field.get('modifiers') || {};
                if(modifiers.required){
                    rule.required = true;
                }
                if(type){
                    switch(type){
                        case 'float':
                            rule.digits = false;
                            rule.number = true;
                            break;
                        case 'integer':
                            rule.digits = true;
                            rule.number = false;
                            break;
                        case 'datetime':
                            rule.date = true;
                            break;
                    }
                }
            });

            this.validator = this.$form.validate({
                rules: rules
            });
        },

        setModel: function(model){
            this.collection.each(function(field){
                field.model = model;
            });
        },

        setMode: function(mode){
            this.collection.mode = mode;
            this.collection.each(function(field){
                field.mode = mode;
            });
        },

        getItemView: function(model){
            var type = model.get('type');
            return this.views[type] ? this.views[type] : this.views['default'];
        },

        render: function(){
            var self = this, args = arguments;
            this.collection
                .ready()
                .done(function(){
                    self.setValidation();
                    _super.render.apply(self, args);
                });
        }
    });

    responsive.views('Form', Form);
});


