# -*- coding: utf-8 -*-
{
	'name': "Manufacture scanning app",
	'summary': """
		Scanning app""",

	'author': "Izabela Raduly",
	'category': 'Uncategorized',
	'version': '15.0.1.0.0',
	'license': "",

	'depends': [
		'base',
		'website',
		'web',
		'mrp'
		],
	'data': [
		'security/scan_security.xml',
		'data/scan_template.xml',
		'data/select_template.xml',
		'data/work_template.xml',
		'data/dashboard_template.xml',
		'views/mrp_routing_view.xml',
		'views/dashboard_menuitem.xml'
	],
	
	'assets': {
        #'web.assets_backend': [
         #   's4b_scanning/static/src/js/control_workorder.js',
        #],
    },

	'installable': True,
	'auto_install': False,
	'application': False,
}