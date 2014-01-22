openerp.unleashed.module('web_responsive').ready(function(instance, responsive){

    instance.web.ViewManagerAction = instance.web.ViewManagerAction.extend({
        template: 'ResponsiveViewManager',

        init: function(parent, dataset, views, flags){
            var ret = this._super.apply(this, arguments);

            this.keyboard = false;
            this.orientation_change = false;

            // set the default view as the view defined in the url, if any
            // Anthony, why it's not like that in your ViewManager... ;(
            var state = $.bbq.getState();
            if('view_type' in state && _(dataset.view_mode.split(',')).contains(state['view_type'])){
                this.flags.default_view = state['view_type'];
                this.active_view = state['view_type'];
            }


            // manage virtual keyboard opening (show/hide head menu)
            this.defaultWindowHeight($(window).outerHeight());
            $(window).on('orientationchange', this.orientationChanged.bind(this));
            $(window).on('resize', this.sizeChanged.bind(this));

            return ret;
        },

        start: function(){

            // resize body area according to screen size
            responsive.on('view:rendered', this.resize, this);
            responsive.on('keyboard:open', this.keyboardOpened, this);
            responsive.on('keyboard:close', this.keyboardClosed, this);

            this.bindUIElements();

            return this._super.apply(this, arguments);
        },

        bindUIElements: function(){
            this.ui = {
                head: this.$('.view_manager_head'),
                body: this.$('.oe_view_manager_body'),
                footer: this.$('.view_manager_footer'),
                pager: this.$('.oe_view_manager_pager'),
                search: this.$('.oe_view_manager_view_search'),

                // special for navbar
                get navigation(){
                    return $('html.mobile .navigation');
                },
                get nav(){
                    return $('html.mobile .navbar-collapse');
                }
            };
        },

        unbindUIElements: function(){
            this.ui = null;
        },

        switch_mode: function(type){
            var ret = this._super.apply(this, arguments);

            // remove search widget and pager if view mode != list
            type != 'list' ? this.ui.search.hide() : this.ui.search.show();
            type != 'list' ? this.ui.pager.hide()  : this.ui.pager.show();


            // close the navbar list
            if(this.ui.nav.is(':visible')){
                this.ui.nav.collapse('hide');
            }

            this.resize();

            return ret;
        },

        defaultWindowHeight: function(value){
            if(value){
                this.defaultHeight = value;
            }
            return this.defaultHeight;
        },

        keyboardOpened: function(){
            this.ui.head.hide();
            this.ui.navigation.hide();
        },

        keyboardClosed: function(){
            this.ui.head.show();
            this.ui.navigation.show();
        },

        sizeChanged: function(){
            // FIXME: should not be detected here...
            var skip = this.active_view != 'form';
            if(this.orientation_change){
                this.orientation_change = false;
                skip = this.keyboard ? true : skip;
            }

            if(!skip){
                /* remove 100 to the default, in case mobile browser has a show/hide url bar feature... */
                if($(window).outerHeight() < this.defaultWindowHeight() - 100 ){
                    this.keyboard = true;
                    responsive.trigger('keyboard:open');
                }
                else {
                    this.keyboard = false;
                    responsive.trigger('keyboard:close');
                    this.defaultWindowHeight($(window).outerHeight());
                }
            }
        },

        orientationChanged: function(){
            this.orientation_change = true;
            this.defaultWindowHeight($(window).outerHeight());
        },

        resize: function(){
            $('.openerp.bootstrap_scope').css({
                marginTop: $('html.mobile .navbar').outerHeight() + this.ui.head.outerHeight() + 'px'
            });
        },

        close: function(){
            this.unbindUIElements();

            $(window).off('resize');
            $(window).off('orientationchange');

            responsive.off('view:rendered');
            responsive.off('keyboard:open');
            responsive.off('keyboard:close');

            return this._super.apply(this, arguments);
        }

    });
});