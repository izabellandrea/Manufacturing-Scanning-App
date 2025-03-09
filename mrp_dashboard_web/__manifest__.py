# -*- coding: utf-8 -*-
{
	'name': "MRP Dashboard web interface",
	'summary': """
		MRP Dashboard web interface""",

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
		'data/dashboard_template.xml',
		'views/mrp_routing_view.xml',
		'views/dashboard_menuitem.xml'
	],


	'installable': True,
	'auto_install': False,
	'application': False,
}