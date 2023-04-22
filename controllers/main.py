from odoo import http
from odoo.http import route, request
from odoo.addons.web.controllers.main import Home
from odoo.addons.mail.models.mail_thread import MailThread
import json

import logging

_logger = logging.getLogger(__name__)


class HomeInherit(Home):

    def _login_redirect(self, uid=None, redirect=None):
        if request.env['res.users'].sudo().browse(uid).has_group('s4b_scanning.scan_group_user'):
            redirect = '/scan'
        return super(HomeInherit, self)._login_redirect(uid, redirect)

class ScanningPage(http.Controller):

    @http.route('/scan', auth='user', type='http',website='True')
    def scan_page(self, **kwargs):
        return request.render('s4b_scanning.scan_template')
    
    #get the name of the scanned barcode and search in the db, pass the response and the id back
    @http.route('/scan/check_mrp_production_order', type='json', auth='public', methods=['POST'])
    def check_mrp_production_order(self, **kw):
        
        data = request.jsonrequest
        mo_name = data.get('manufacturing_order_name')
        production_order = request.env['mrp.production'].search([('name', '=', mo_name)])
        
        if production_order:
            if production_order.state=='confirmed' or production_order.state=='progress':
                return {'exists': True,'mo_id': production_order.id, 'inactive' : False}
            else:
                return {'exists': True,'inactive' : True}
            
        else:
            return {'exists': False , 'inactive' : False}
    
    @http.route('/select', auth='user', type='http',website='True')
    def select_page(self, **kwargs):
        mo_id = int(kwargs.get('mo_id'))

        manufacturing_order = request.env['mrp.production'].sudo().browse(mo_id)

        return http.request.render('s4b_scanning.select_template', {
            'mo_id' : mo_id,
            'manufacturing_order': manufacturing_order
        })

    @http.route('/select/get_related_wos', type='http', auth='user', website=True, csrf=False)
    def get_related_wos(self, **kw):
        mo_id = kw.get('mo_id')
        if mo_id:
            workorders = request.env['mrp.workorder'].sudo().search([('state', 'not in', ['done', 'cancel'])])
            related_wos = workorders.filtered(lambda wo: wo.production_id.id == int(mo_id)).mapped(lambda wo: {'id': wo.id, 'name': wo.name,'state': wo.state})
            return json.dumps({'related_wos': related_wos})
        else:
            return json.dumps({'related_wos': []})

    @http.route('/work', auth='user', type='http')
    def work_page(self, **kwargs):
        mo_id = int(kwargs.get('mo_id'))
        wo_id = int(kwargs.get('wo_id'))

        manufacturing_order = request.env['mrp.production'].sudo().browse(mo_id)
        work_order = request.env['mrp.workorder'].sudo().browse(wo_id)

        return http.request.render('s4b_scanning.work_template', {
            'manufacturing_order': manufacturing_order,
            'work_order': work_order,
            'wo_id': wo_id,
        })

    #check if that mo wo combination from the link is valid 
    @http.route('/work/check_mo_wo_combination', type='json', auth='public', methods=['POST'])
    def check_mo_wo_combination(self, **kw):
        
        data = request.jsonrequest
        mo_id = data.get('mo_id')
        wo_id = data.get('wo_id')
        
        wo = request.env['mrp.workorder'].sudo().search([('id', '=', wo_id), ('production_id.id', '=', mo_id)], limit=1)

        if wo:
            return {'exists': True}
        else:
            return {'exists': False}

    #for buttons
    
    @http.route('/start', type='http', auth='user', website=True, csrf=False)
    def call_button_start(self, **kwargs):
        workorder_id = int(kwargs.get('workorder_id'))
        workorder = http.request.env['mrp.workorder'].browse(workorder_id)
        workorder.button_start()
        return "Success"
    
    @http.route('/pause', type='http', auth='user', website=True, csrf=False)
    def call_button_pause(self, **kwargs):
        workorder_id = int(kwargs.get('workorder_id'))
        workorder = http.request.env['mrp.workorder'].browse(workorder_id)
        workorder.button_pending()
        return "Success"
    
    @http.route('/stop', type='http', auth='user', website=True, csrf=False)
    def call_button_stop(self, **kwargs):
        workorder_id = int(kwargs.get('workorder_id'))
        workorder = http.request.env['mrp.workorder'].browse(workorder_id)
        workorder.button_finish()
        return "Success"


    @http.route('/send_message', type='http', auth="user",website=True, csrf=False)
    def send_notification(self, **kw):

        notification_service = request.env['notification.service']

        success = notification_service.send_notification([1,2], 'hello', 'szia')
        return "success"
