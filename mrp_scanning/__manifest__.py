# -*- coding: utf-8 -*-
{
	'name': "Manufacture scanning app",
	'summary': """
		Scanning app""",

	'author': "Izabela Raduly",
	'category': 'Uncategorized',
	'version': '15.0.2.0.0',
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
	],

	'installable': True,
	'auto_install': False,
	'application': False,
}