// overrides/addons in any mode (mobile/desktop)
openerp.unleashed.module('web_responsive').ready(function(instance){

    // override to make standard OpenERP view to avoid
    // the interpretation of "mobile" tag in arch description
    var remove_mobile_tag = function(children){
        var child, i=0;
        for(; i < children.length ; i++){
            child = children[i];
            if(child.tag == 'mobile'){
                children.splice(i, 1);
            }
        }
        return children;
    };

    var setup = instance.web.ListView.prototype.setup_columns;
    instance.web.ListView.prototype.setup_columns = function(){
        remove_mobile_tag(this.fields_view.arch.children);
        return setup.apply(this, arguments);
    };

    var fragment = instance.web.form.FormRenderingEngine.prototype.get_arch_fragment;
    instance.web.form.FormRenderingEngine.prototype.get_arch_fragment = function(){
        remove_mobile_tag(this.fvg.arch.children);
        return fragment.apply(this, arguments);
    };

    // add a button on user menu to force mobile version
    instance.web.UserMenu =  instance.web.UserMenu.extend({
        template: 'UserMenuWithMobile',
        on_menu_mobile: function(){
            openerp.unleashed.forceMobile(!openerp.unleashed.forceMobile());
            window.location.reload();
        }
    });
});


(function(responsive, mobile){
    var ready = responsive.ready;

    responsive.ready = function(callback){
        var mobile_callback = function(){
            if(openerp.unleashed.mobile){
                callback.apply(this, arguments);
            }
        };
        ready.apply(responsive, [mobile_callback]);
    };

})(openerp.unleashed.module('web_responsive'));