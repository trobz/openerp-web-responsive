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
        }, 
        
		on_logout: function() {
	        var self = this;
	        if (!this.has_uncommitted_changes()) {
	        	
	            // Delete force_mobile cookie
	            this.session.set_cookie('force_mobile', '');
	            
	            this.session.session_logout().done(function () {
	                $(window).unbind('hashchange', self.on_hashchange);
	                self.do_push_state({});
	                window.location.reload();
	            });
	        }
	    },
    });
});
