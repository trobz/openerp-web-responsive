openerp.unleashed.module('web_responsive').ready(function(instance){
    instance.web.Menu =  instance.web.Menu.extend({

        template: 'ResponsiveMenu',

        menu_loaded: function(){
            this._super.apply(this, arguments);
            this.$('a.switch-mobile').on('click', this.switchMobile);
        },

        switchMobile: function(e){
            if(e) e.preventDefault();
            openerp.unleashed.forceMobile(!openerp.unleashed.forceMobile());
            window.location.reload();
        }
    });
});
