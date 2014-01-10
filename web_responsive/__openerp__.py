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
        'static/src/css/manager.css',
        'static/src/css/login.css',
        'static/src/css/button.css',
        'static/src/css/menu.css',
        'static/src/css/form.css',
        'static/src/css/list.css',
    ],
    'js': [
        # activate module ready state only in mobile mode
        'static/src/js/mobile_ready.js',

        # mobile buttons
        'static/src/js/views/buttons.js',

        # mobile form
        'static/src/js/models/form_state.js',
        'static/src/js/models/field.js',
        'static/src/js/models/separator.js',
        'static/src/js/collections/structure.js',
        'static/src/js/views/widgets/separator.js',
        'static/src/js/views/widgets/input.js',
        'static/src/js/views/form.js',

        # mobile list
        'static/src/js/views/list.js',

        # OpenERP overrides
        'static/src/js/manager.js',
        'static/src/js/client.js',
        'static/src/js/menu.js',
        'static/src/js/form.js',
        'static/src/js/list.js',

    ],
    'data': [],
    'test': [],
    'demo': [],
    # use same option has OpenERP web module
    'auto_install': True,
    'bootstrap': True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
