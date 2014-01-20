openerp.unleashed.module('web_responsive').ready(function(instance){
    instance.web.Menu =  instance.web.Menu.extend({
        template: 'ResponsiveMenu',

        menu_loaded: function(){
            this._super.apply(this, arguments);
            this.$('a.switch-mobile').on('click', this.switchMobile.bind(this));
            this.$('a.logout').on('click', this.logout.bind(this));
        },

        switchMobile: function(e){
            if(e) e.preventDefault();
            openerp.unleashed.forceMobile(!openerp.unleashed.forceMobile());
            window.location.reload();
        },

        logout: function(e){
            if(e) e.preventDefault();
            this.trigger('user_logout');
        },

        close: function(){
            this.$('a.switch-mobile').off();
            this.$('a.logout').off();
            return this._super.apply(this, arguments);
        },

        reflow: function(){
            //disable default OpenERP reflow behavior...
        },

        on_top_menu_click: function(ev) {
            var self = this;
            var id = $(ev.currentTarget).data('menu');
            var menu_ids = [id];
            var menu = _.filter(this.data.data.children, function (menu) {return menu.id == id;})[0];
            function add_menu_ids (menu) {
                // FIXME: understand why we get an error in mobile mode with submenu (but everything work fine...)
                if (menu && menu.children) {
                    _.each(menu.children, function (menu) {
                        menu_ids.push(menu.id);
                        add_menu_ids(menu);
                    });
                }
            };
            add_menu_ids(menu);
            self.do_load_needaction(menu_ids).then(function () {
                self.trigger("need_action_reloaded");
            });
            this.on_menu_click(ev);
        },
    });
});


