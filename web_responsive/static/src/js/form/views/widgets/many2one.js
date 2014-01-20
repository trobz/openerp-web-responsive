openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){


    var Collection = base.collections('BaseCollection');


    var Input = responsive.views('Input'),
        _super = Input.prototype;

    var Many2OneInput = Input.extend({

        events: {
        },

        ui: {
            input: 'input:not(.dummy)',
            dummy: 'input.dummy',
            display:  'span.value'
        },

        initialize: function(options){
            _super.initialize.apply(this, arguments);

            this.options = _.extend({
                fieldname: 'name',
                limit: 100
            }, this.field.get('options'));

            var field = this.field,
                fieldname = this.options.fieldname,
                limit = this.options.limit;

            var DataCollection = Collection.extend({
                model_name: field.get('relation'),

                data: function(){
                    return [[{
                        label: field.get('field_description'),
                        keys: this.map(function(record){ return record.get('id')}),
                        values: this.map(function(record){ return record.get(fieldname)})
                    }]];
                },

                search: function(query){
                    query = query || {};
                    var domain = field.domain();

                    return _.extend({
                        fields: ['id', fieldname],
                        filter: domain.concat(query.domain || []),
                        reset: false,
                        remove: false
                    }, query);
                }
            });

            var collection  = this.collection = new DataCollection();

            // clear the collection when field.domain change
            this.listenTo(this.field, 'change:domain', function(){ collection.reset();});
        },

        value: function(value){
            var values = _super.value.apply(this, [value]),
                has_value = _.isArray(values) && values.length >= 2,
                only_id = _.isNumber(values);

            return has_value ? values[0] : (only_id ? values: null);
        },

        text: function(){
            var item = this.collection.get(this.value());
            return item ? item.get(this.options.fieldname) : '';
        },


        render: function(){
            var args = arguments;
            this.addSelectedRecord(function(){
                _super.render.apply(this, args);
            });
        },

        onRender: function(){
            if(this.modifiers.readonly !== true && this.field.mode != 'view'){
                this.ui.input.scroller('destroy').scroller({
                    preset: 'many2one',
                    value: this.value(),
                    collection: this.collection,
                    onSelect: this.onSelect.bind(this),
                    onBeforeShow: this.onBeforeShow.bind(this),
                    inputClass: 'form-control dummy',
                    theme: 'default',
                    mode: 'scroller',
                    display: 'bottom',
                    animation: ''
                });

                this.bindUIElements();

                this.ui.dummy.attr({
                    placeholder: this.field.get('field_description'),
                    name: this.field.get('name') + '_dummy'
                });

                this.scroller = this.ui.input.scroller('getInst');
            }
            this.refresh();
        },

        onBeforeShow: function(){
            return this.collection.fetch();
        },

        refresh: function(){
            this.addSelectedRecord(function(){
                this.bindUIElements();

                var value = this.value(), text = this.text();
                if(!this.modifiers.readonly && this.field.mode != 'view'){
                    this.ui.dummy.val(text);
                    this.ui.input.val(value);
                    this.scroller.setValue(value);
                }
                else {
                    this.ui.display.text(text);
                }
            });
        },

        onSelect: function(val){
            this.value(val);
        },

        serializeData: function(data){
            return _.extend(this.field.toJSON(), {
                input_type: this.field.inputType(),
                type: this.field.get('type'),
                modifiers: this.modifiers,
                mode: this.modifiers.readonly ? 'view' : this.field.mode,
                value: this.value(),
                text: this.text()
            });
        },

        addSelectedRecord: function(callback){
            $.when(
                this.value() && !this.text() ?
                this.collection.fetch({
                    limit: 1,
                    filter: [['id', '=', this.value() ]],
                    reset: false,
                    remove: false
                }) : null
            ).done(callback.bind(this));
        },

        onClose: function(){
            if(this.scroller){
                this.scroller.destroy();
            }
            return _super.onClose.apply(this, arguments);
        }

    });

    responsive.views('Many2OneInput', Many2OneInput);
});