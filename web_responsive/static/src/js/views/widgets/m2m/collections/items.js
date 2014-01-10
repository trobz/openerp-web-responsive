openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){

    var Item = responsive.models('Item'),
        Collection = base.collections('BaseCollection'),
        _super = Collection.prototype;

    var Items = Collection.extend({
        model: Item,

        initialize: function(data, options){
            options = options || {};
            this.unique = options.unique;
            this.query = options.query;
            this.selected = options.selected || [];
        },

        update: function(){
            this.fetch(this.query).done(function(){
                this.initSelection(this.selected);
            }.bind(this));
        },

        fetch: function(query){
            var def = $.Deferred(),
                selection = this.selection(),
                promise;

            promise = _super.fetch.apply(this, [query]);

            promise.done(function(){
                this.add(selection.models);
                def.resolve();
            }.bind(this));

            return def.promise();
        },

        ids: function(){
            return this.map(function(item){
                return item.get('id');
            });
        },

        hasSelection: function(){
            return !!this.findWhere({selected: true});
        },

        selection: function(){
            var models = this.filter(function(item){
                return item.get('selected') == true;
            });
            return new this.constructor(models);
        },

        initSelection: function(ids){
            this.each(function(item){
                if(_(ids).contains(item.get('id'))){
                    item.select();
                }
            });
        },

        resetSelection: function(options){
            this.each(function(item){
                item.set({ selected: false }, options);
            });
        },

        selectFirst: function(options){
            var first = this.at(0);
            if(first){
                first.set({ selected: true }, options);
            }
        }
    });

    responsive.collections('Items', Items);
});