openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Tag = responsive.models('Tag'),
        _super = Tag.prototype;

    var Field = Tag.extend({

        model_name: 'ir.model.fields',

        initialize: function(data, options){
            var ret = _super.initialize.apply(this, arguments);

            this.attributes = _.parse(this.attributes);
            this.on_change = null;

            this.ready = this.fetch();
            this.ready.done(function(){
                this.set('type', this.get('ttype'), {silent: true});
                this.bind();
            }.bind(this));


            return ret;
        },

        bind: function(){
            this.setupOnChange();
            this.listenTo(this, 'define:model', this.setupOnChange);
        },

        unbind: function(){
            this.stopListening();
        },

        domain: function(){
            var origin_domain = this.get('domain') || [],
                domain = [], criterion,
                model = this.model, value;

            //process dynamic domain fields
            _(origin_domain).each(function(origin_criterion){
                criterion = _.clone(origin_criterion);
                if(_.isArray(criterion) && model.exist(_(criterion).last())){
                    value = model.get(_(criterion).last());
                    value = _.isArray(value) && value.length > 1 ? value[0] : value;
                    value = _.isString(value) && value.length == 0 ? null : value;
                    criterion[criterion.length - 1] = value;
                }
                domain.push(criterion);
            });

            return domain;
        },

        setupOnChange: function(){
            var model = this.model,
                on_change = this.get('on_change'),
                pattern = /([a-z0-9_\-]+)/ig,
                matches = on_change ? on_change.match(pattern) : null;

            if(matches){
                var method = matches.shift();

                var params = function(){
                    var params = _(matches).parse(function(param){
                        var val = model.exist(param) ? model.get(param) || '' : param;
                        return _.isArray(val) && val.length > 1 ? val[0] : val;
                    });
                    return [model.get('id') || ''].concat(params);
                };

                var events = _(matches)
                    .chain()
                    .filter(function(param){
                        return model.exist(param);
                    })
                    .map(function(field){
                        return 'change:' + field;
                    })
                    .value();

                model.onChange({
                    method: method,
                    params: params,
                    events: events
                });
            }
        },

        inputType: function(){
            var type = 'text';
            switch (this.get('ttype')) {
                case 'date':
                    type = 'date';
                    break;
                case 'datetime':
                    type = 'datetime';
                    break;
                case 'time':
                    type = 'time';
                    break;
                case 'float':
                case 'integer':
                    type = 'number';
                    break;
                case 'many2one':
                    type = 'hidden';
                    break;
            }
            return type;
        },

        fetch: function(query){
            // hack to keep the domain alive (or JSON-RPC will override the view domain...)
            var domain = this.get('domain');
            var promise = Backbone.Model.prototype.fetch.apply(this, [this.search(query)]);

            return promise.done(function(){
                this.set('domain', domain, {silent: true});
            }.bind(this));
        },

        search: function(query){
            query = query || {};

            var filter = query.filter || [];
            filter.push(
                ['model', '=', this.model.model_name],
                ['name', '=', this.get('name')]
            );

            return _.extend({
                filter: filter,
                type: 'first'
            }, query);
        }
    });

    responsive.models('Field', Field);
});


