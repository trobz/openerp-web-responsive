openerp.unleashed.module('web_responsive').ready(function(instance){
    instance.web.WebClient = instance.web.WebClient.extend({
        init: function(parent) {
            this._template = 'ResponsiveWebClient';
            this._super(parent);
        },

        show_application: function(){
            var ret = this._super.apply(this, arguments);
            this.menu.on('user_logout', this, this.on_logout);
            return ret;
        }
    });
});