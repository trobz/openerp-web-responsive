openerp.unleashed.module('web_responsive', function(responsive, _, Backbone, base){



    var Input = responsive.views('Input'),
        _super = Input.prototype;

    var DateTimeInput = Input.extend({

        format: 'YYYY-MM-DD HH:mm:ss',

        ui: {
            input: 'input'
        },

        onRender: function(){
            if(this.modifiers.readonly !== true && this.field.mode != 'view'){
                // FIXME: force formatting here, should be based on language user settings
                $.mobiscroll.i18n.en = $.extend($.mobiscroll.i18n.en, {
                    dateFormat: 'yyyy-mm-dd',
                    dateOrder: 'yyyymmdd',
                    timeWheels: 'hhiiA',
                    timeFormat: 'hh:ii A'
                });

                this.ui.input.scroller('destroy').scroller({
                    preset: 'datetime',
                    format: this.format,
                    minDate: moment().subtract(5, 'year').toDate(),
                    maxDate: moment().add(5, 'year').toDate(),
                    stepMinute: 1,
                    formatResult: function(d){
                        _(d).each(function(val, index){
                            d[index] = parseInt(val);
                        });
                        return moment([ d[0], d[1], d[2], d[3] + (12 * d[5]), d[4]]).format('YYYY-MM-DD HH:mm:ss');
                    },
                    theme: 'default',
                    mode: 'scroller',
                    display: 'bottom',
                    animation: ''
                });

                this.scroller = this.ui.input.scroller('getInst');
            }
        },

        value: function(value){
            value = value ? moment(value, this.format, true).utc() : value;
            value = _super.value.apply(this, [value]);
            return moment.isMoment(value) ? value.local().format(this.format) : value;
        },

        onClose: function(){
            if(this.scroller){
                this.scroller.destroy();
            }
            return _super.onClose.apply(this, arguments);
        }
    });

    responsive.views('DateTimeInput', DateTimeInput);
});