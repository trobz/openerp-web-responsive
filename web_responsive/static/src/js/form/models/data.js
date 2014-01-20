openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Model = base.models('BaseModel'),
        _super = Model.prototype;

    var DataModel = Model.extend({

        format: {
            'datetime': 'YYYY-MM-DD HH:mm:ss',
            'date': 'YYYY-MM-DD'
        },

        initialize: function(attrs, options){
            this.commit();
            return _super.initialize.apply(this, arguments);
        },

        save: function(options){
            // get fields to save from the structure
            if(!this.structure){
                throw new Error('model should have a structure attached to define which fields have to be saved');
            }

            var attrs = this.toJSON(this.structure.fieldNames()),
                options = _.extend({
                    parse: true,
                    patch: true,
                    silent: true
                }, options);

            var promise = _super.save.apply(this, [attrs, options]);
            promise.done(this.commit.bind(this));
            return promise;
        },

        rollback: function(options){
             this.set(_.clone(this.attributes_origin), options);
        },

        commit: function(){
             this.attributes_origin = _.clone(this.attributes);
        },

        fetch: function(){
            var promise = _super.fetch.apply(this, arguments);
            promise.done(this.commit.bind(this));
            return promise;
        },

        parse: function(response, options){
            options = options || {}
            // when parse is called by save method in patched mode, attributes are on options.attrs
            response = options.attrs || response;

            var date, format = this.format;
            if($.isPlainObject(response)){
                _(response).each(function(value, name){
                    // date
                    date = moment.utc(value, format.datetime, true);
                    if(date.isValid()){
                        response[name] = date.local();
                    }
                });
            }

            return response;
        },

        toJSON: function(fields, options){
            var attrs = {}, format = this.format;

            options = options || {};

            _(this.attributes).each(function(value, name){
                if(!fields || _.isArray(fields) && _(fields).contains(name)){
                    // convert back date to GMT
                    if(moment.isMoment(value)){
                        attrs[name] = (options.local ? value.local() : value.utc()).format(format.datetime);
                    }
                    // when value returned by openerp is a many2one like [id, name]
                    else if(_(value).isArray() && value.length > 1 && !options.keep_array){
                        attrs[name] = value[0];
                    }
                    else {
                        attrs[name] = value;
                    }
                }
            });

            return attrs;
        },

        onChange: function(options){
            if(options.events){
                var events = options.events.join(' ');

                this.stopListening(this, events);

                this.listenTo(this, events, (function(on_change){
                    return function(model, value, options){
                        this.getChanges(on_change.method, on_change.params());
                    };
                })(options));
            }
        },

        getChanges: function(method, params){
            return this.rpcCall(method, params,
                function(result){
                    if(result.value){
                        this.set(result.value);
                    }
                    if(result.domain){
                        this.structure.applyDomain(result.domain);
                    }
                }
            );
        },

        getFields: function(){
            return this.rpcCall('fields_get', _.toArray(arguments),
                function(data){
                    var fields = {};
                    _(data).each(function(val, name){
                        if(name != 'id'){
                            fields[name] = null;
                        }
                    });

                    this.set(fields);
                    this.commit();
                }
            );
        },

        getDefaults: function(){
            return this.rpcCall('default_get',  _.toArray(arguments),
                function(defaults){
                    this.set(this.parse(defaults));
                    this.commit();
                }
            );
        },

        rpcCall: function(method, args, callback){
            return this.sync('call', { model_name: this.model_name }, {
                method: method,
                args:   args
            }).done(callback.bind(this));
        },

        // check if an attribute exist in the model
        exist: function(field){
            return field in this.attributes;
        }
    });

    responsive.models('Data', DataModel);
});
