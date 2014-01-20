# -*- coding: utf-8 -*-
{
    'name': 'Web Responsive',
    'version': '1',
    'category': 'Hidden',
    'description':  """
Make native form, list views responsive, based on Twitter Bootstrap 3
""",
    'author': 'Trobz',
    'website': 'http://www.trobz.com',
    'depends': [
        # Trobz standard modules
        'web_unleashed_extra',
    ],


    'qweb': [
        'static/src/templates/*.xml',
    ],
    'css': [
        # mobiscroll css
        'static/lib/mobiscroll/css/mobiscroll.scroller.css',
        'static/lib/mobiscroll/css/mobiscroll.animation.css',


        'static/src/css/manager.css',
        'static/src/css/login.css',
        'static/src/css/button.css',
        'static/src/css/menu.css',
        'static/src/css/form.css',
        'static/src/css/list.css',
    ],
    'js': [
        # touch event support
        'static/lib/jquery-mobile-events/jquery.mobile-events.js',

        # mobiscroll (mobile datetime / list selection)
        'static/lib/mobiscroll/js/mobiscroll.core.js',
        'static/lib/mobiscroll/js/mobiscroll.scroller.js',

        # mobile detection
        'static/src/js/mobile.js',

        # activate module ready state only in mobile mode
        'static/src/js/mobile_ready.js',

        # mobile buttons
        'static/src/js/common/buttons.js',

        # mobile data model
        'static/src/js/form/models/data.js',
        'static/src/js/list/collections/data.js',

        # mobile form
        'static/src/js/form/models/state.js',
        'static/src/js/form/models/structure/tag.js',
        'static/src/js/form/models/structure/info.js',
        'static/src/js/form/models/structure/field.js',
        'static/src/js/form/models/structure/separator.js',
        'static/src/js/form/collections/structure.js',
        'static/src/js/form/views/widgets/mobiscroll/datetime.js',
        'static/src/js/form/views/widgets/mobiscroll/many2one.js',
        'static/src/js/form/views/widgets/widget.js',
        'static/src/js/form/views/widgets/separator.js',
        'static/src/js/form/views/widgets/info.js',
        'static/src/js/form/views/widgets/input.js',
        'static/src/js/form/views/widgets/textarea.js',
        'static/src/js/form/views/widgets/many2one.js',
        'static/src/js/form/views/widgets/datetime.js',
        'static/src/js/form/views/form.js',

        # mobile list
        'static/src/js/list/views/list.js',

        # OpenERP overrides
        'static/src/js/core/manager.js',
        'static/src/js/core/client.js',
        'static/src/js/core/menu.js',
        'static/src/js/form/form.js',
        'static/src/js/list/list.js',

    ],
    'data': [],
    'test': [],
    'demo': [],
    # use same option has OpenERP web module
    'auto_install': True,
    'bootstrap': True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
