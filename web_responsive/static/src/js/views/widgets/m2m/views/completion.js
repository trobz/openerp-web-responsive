openerp.unleashed.module('web_responsive', function(responsive, _, Backbone){


    var Items = responsive.views('Items');


    var Completion = Backbone.Marionette.Layout.extend({

        className: 'completion',

        template: 'Effimax.WidgetMany2ManyCompletion.popin',

        regions: {
            selection: '.selection',
            items: '.items'
        },

        events: {
            'keyup input': 'keyPress',
            'click .action .ok': 'validate',
            'click .action .cancel': 'cancel'

        },

        ui: {
            input: 'input',
            count: '.count'
        },

        initialize: function(options){
            this.$input = options.$el;

            this.collection = options.collection;

            this.query = _.extend({
                filter: options.domain,
                limit: 10
            }, options.query);

            this.search = '';
        },

        onRender: function(){
            this.selection.show(
                new Items({
                    collection: this.collection,
                    itemView: responsive.views('Select')
                })
            );

            this.items.show(
                new Items({
                    collection: this.collection,
                    itemView: responsive.views('Item')
                })
            );

            var pos = this.$input.position();

            this.$el.css({
                left: pos.left,
                top: this.$input.outerHeight() + pos.top
            });
        },


        cancel: function(e){
            if(e) e.preventDefault();
            this.trigger('cancel');
        },


        validate: function(e){
            if(e) e.preventDefault();
            this.trigger('validate', this.collection.selection());
        },

        keyPress: function(e){
            var $el = $(e.currentTarget);
            this.search = $el.val();
            this.updateCollection();
        },


        updateCollection: function(){
            var filters = _.clone(this.query.filter);

            filters.push(['name', 'ilike', this.search ]);

            var promise = this.collection.fetch(
                _.extend({}, this.query, {
                    filter: filters
                })
            );

            promise.done(this.highlightSearch.bind(this));
        },

        highlightSearch: function(){
            var search = this.search;
            this.$el.find('.items li span.title').each(function(i, el){
                var $el = $(el),
                    html = $el.text();

                var pattern = new RegExp('(' + search + ')', 'i');
                $el.html(
                    html.replace(pattern, '<b>$1</b>')
                );
            });
        }
    });

    responsive.views('Completion', Completion);
});