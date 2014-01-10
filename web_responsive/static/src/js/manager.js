openerp.unleashed.module('web_responsive').ready(function(instance, responsive){
    instance.web.ViewManagerAction = instance.web.ViewManagerAction.extend({
        template: 'ResponsiveViewManager',

        start: function(){

            this.ui = {
                head: this.$('.view_manager_head'),
                body: this.$('.oe_view_manager_body'),
                footer: this.$('.view_manager_footer'),
                search: this.$('.oe_view_manager_view_search'),
                //special for navbar...
                nav: $('html.mobile .navbar-collapse')
            };

            // resize body area according to screen size
            $(window).on('resize', this.resize.bind(this));

            return this._super.apply(this, arguments);
        },

        switch_mode: function(type){
            var ret = this._super.apply(this, arguments);

            // remove search widget if view mode != list
            if(type != 'list'){
                this.ui.search.hide();
            }
            else {
                this.ui.search.show();
            }

            // close the navbar list
            if(this.ui.nav.is(':visible')){
                this.ui.nav.collapse('hide');
            }

            this.resize();
            return ret;
        },

        resize: function(){
            this.ui.body.height(
                $(window).outerHeight()
                - this.ui.body.position().top
                - this.ui.footer.outerHeight()
                - parseInt(this.ui.body.css('padding-top') || 0)
                - parseInt(this.ui.body.css('padding-bottom') || 0)
                - 1
            );
        },

        close: function(){
            $(window).off('resize');

            return this._super.apply(this, arguments);
        }

    });
});