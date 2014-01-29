openerp.unleashed.module('web_responsive').ready(function(instance, responsive, _, Backbone){

   (function ($) {

        var defaults = {
            showInput: true,
            inputClass: '',
            value: 1,
            collection: null
        };

        $.mobiscroll.presets.many2one = function(inst) {
            var orig = $.extend({}, inst.settings),
                s = $.extend(inst.settings, defaults, orig),
                id = this.id + '_dummy',
                value = s.value,
                elm = $(this);

            if (s.showInput) {
                input = $('<input type="text" id="' + id + '" value="" class="' + s.inputClass + '" readonly />').insertBefore(elm);
                s.anchor = input;
                inst.attachShow(input);
            }

            if(!(s.collection instanceof Backbone.Collection)){
                throw new Error('many2one scroller need a Backbone.Collection has parameter');
            }

            var updateWheel = function(){
                inst.settings.wheels = s.collection.data();
                inst.changeWheel([0]);
            };

            s.collection.on('reset sync', updateWheel);

            return {
                wheels: s.collection.data(),

                onShow: function(html, valueText, inst){
                    // FIXME: smell like a hack, but I don't know how to make
                    // my hashchange event handler be called before OpenERP one...
                    $(window).unbind('hashchange');
                    $(window).bind('hashchange', function(e){
                         e.preventDefault();
                         inst.cancel();
                    });
                },

                onClose: function(){
                    $(window).unbind('hashchange');
                    $(window).bind('hashchange', instance.webclient.on_hashchange);
                },

                onDestroy: function(inst){
                    $(window).unbind('hashchange');
                    $(window).bind('hashchange', instance.webclient.on_hashchange);
                    inst.settings.collection.off('reset sync', updateWheel);
                },

                formatResult: function(d) {
                    return d[0];
                },

                parseValue: function() {
                    return [elm.val()];
                }
            }
        };

        $.mobiscroll.presetShort('many2one');

    })(jQuery);


});