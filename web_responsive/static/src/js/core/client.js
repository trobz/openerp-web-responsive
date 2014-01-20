openerp.unleashed.module('web_responsive').ready(function(instance){
    instance.web.WebClient = instance.web.WebClient.extend({
        init: function(parent) {
            this._template = 'ResponsiveWebClient';
            this._super(parent);
        }
    });
});