from odoo import models, fields, api

class MrpRouting(models.Model):
    _inherit = 'mrp.routing.workcenter'

    operation_percentage = fields.Float(string='Operation Percentage')
