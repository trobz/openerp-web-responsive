openerp.unleashed.module('web_responsive').ready(function(instance, responsive, _, Backbone, base){

    openerp.unleashed.forceMobile = function(state){
        if(_.isBoolean(state)){
            instance.session.set_cookie('force_mobile', state);
        }
        return instance.session.get_cookie('force_mobile');
    };

    openerp.unleashed.mobile = (function(m){
        // check user agent
        var mobile = (function(ua){
            return /Mobile|iP(hone|od|ad)|Android|BlackBerry/i.test(ua);
            })(navigator.userAgent||navigator.vendor||window.opera);

        // mobile forced by the user
        var force_mobile = openerp.unleashed.forceMobile();
        if(_.isBoolean(force_mobile)) return force_mobile;

        // additional check based on resolution and touch support, in case the regular expression failed...
        return mobile || (Modernizr.mq('(max-width:767px)') && $('html.mzr-touch').length > 0);

    })(Modernizr);

    // define mobile detection in cookie at first load
    openerp.unleashed.forceMobile(openerp.unleashed.mobile);

    // set a specific class to html DOM element
    $('html').addClass(
        openerp.unleashed.mobile ? 'mobile' : 'not-mobile'
    );

});
