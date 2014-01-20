openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Collection = Backbone.Marionette.CollectionView;
        _super = Collection.prototype;

    var Form = Collection.extend({

        tagName: 'fieldset',

        views: {
            'separator': responsive.views('Separator'),
            'info': responsive.views('Info'),
            'default': responsive.views('Input'),
            'char': responsive.views('Input'),
            'date': responsive.views('Input'),
            'datetime': responsive.views('DateTimeInput'),
            'integer': responsive.views('Input'),
            'textarea': responsive.views('Textarea'),
            'many2one': responsive.views('Many2OneInput')
        },

        ui: {
            input: 'input'
        },

        initialize: function(options){
            var Structure = responsive.collections('Structure');
            this.$form = options.form;

            var def = $.Deferred();

            this.collection = new Structure([],{
                description: options.arch,
                mode: options.mode,
                model: this.model
            });

            // FIXME: should not have this dependencies, but it's required to update the field domain at "on_change"
            this.model.structure = this.collection;

            $.when(
                this.model.isNew() ? this.model.getFields() : null,
                this.collection.populate()
            )
            .done(function(){
                this.configValidation();
                def.resolve();
            }.bind(this));

            this.ready = def.promise();
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
            var rules = {}, rule, name, type, modifiers;

            this.collection.each(function(field){
                type = field.get('ttype');
                name = field.get('name');
                modifiers = field.get('modifiers') || {};

                if(modifiers.readonly != true){
                    if(_(['many2one']).contains(type)){
                        name += '_dummy';
                    }

                    rule = rules[name] = {};
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
                }
            });

            this.validator = this.$form.validate({
                rules: rules
            });
        },

        setModel: function(model){
            this.model = model;
            // FIXME: should not have this dependencies, but it's required to update the field domain at "on_change"
            this.model.structure = this.collection;
            this.collection.each(function(field){
                field.setModel(model);
            });
        },

        setMode: function(mode){
            this.collection.mode = mode;
            this.collection.each(function(field){
                field.setMode(mode);
            });
        },

        getItemView: function(model){
            var type = model.get('widget') || model.get('type');
            return this.views[type] ? this.views[type] : this.views['default'];
        },

        refresh: function(){
            this.children.each(function(view){
                view.render();
            });
        },

        render: function(){
            var model = this.model,
                fields = this.collection.fieldNames(),
                args = arguments;


            var render = function(){
                _super.render.apply(this, args);
            }.bind(this);

            this.ready.done(function(){
                this.setValidation();
                $.when(
                    model.isNew() ? model.getFields() : null
                )
                .then(function(){
                    return model.isNew() ? model.getDefaults(fields) : null
                })
                .done(render);
            }.bind(this));
        },

        onRender: function(){
            responsive.trigger('view:rendered', this);
        }
    });

    responsive.views('Form', Form);
});


