# -*- coding: utf-8 -*-

from openerp.tools import view_validation

def valid_field_in_tree_mobile(arch):
    """A `tree` must have `string` attribute and an immediate node of `tree` view must be `field` or `button`."""
    if arch.xpath('//tree[not (@string)]'):
        return False
    for child in arch.xpath('/tree/child::*'):
        if child.tag not in ('field', 'button', 'mobile'):
            return False
    return True



# monkey patch to allow mobile tag in tree view arch
# smell not good, but well.. OpenERP doesn't help so much to do such extension...
view_validation.valid_field_in_tree = valid_field_in_tree_mobile

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

