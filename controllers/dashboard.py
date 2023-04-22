from odoo import http
from odoo.http import route, request
from datetime import datetime, timedelta
import pytz
import json

import logging

_logger = logging.getLogger(__name__)


class Dashboard(http.Controller):

    @http.route('/dashboard', auth='user', type='http',website='True')
    def dashboard(self, **kwargs):
        mo_data = self.get_mo_data()
        confirmed_mos = request.env['mrp.production'].search_count([('state', '=', 'confirmed')])
        confirmed_mos_list = request.env['mrp.production'].search([('state', '=', 'confirmed')])
        in_progress_mos = request.env['mrp.production'].search_count([('state', '=', 'progress')])
        to_close_mos = request.env['mrp.production'].search_count([('state', '=', 'to_close')])
        done_mos = request.env['mrp.production'].search_count([('state', '=', 'done')])
        
        #get the number of products finished today
        today = datetime.now().date()
        finished_domain = [('state', '=', 'done'), ('date_finished', '>=', today), ('date_finished', '<=', today)]
        today_finished_mos = request.env['mrp.production'].search(finished_domain)
        today_finished_products_count = 0
        for mo in today_finished_mos:
            today_finished_products_count += len(mo.move_raw_ids.filtered(lambda x: x.state == 'done'))

        return request.render('s4b_scanning.dashboard_template', {
            'mo_data': mo_data, 
            'confirmed_mos':confirmed_mos,
            'confirmed_mos_list':confirmed_mos_list,
            'in_progress_mos':in_progress_mos, 
            'to_close_mos':to_close_mos, 
            'done_mos':done_mos,
            'today_finished_products_count':today_finished_products_count
        })
    
    def get_mo_data(self):
        mos = request.env['mrp.production'].search([('state', 'in', ['confirmed', 'progress'])])
        mo_data = []
        for mo in mos:
            total_percentage = sum(wo.operation_id.operation_percentage for wo in mo.workorder_ids if wo.state == 'done')
            wo_list = [{'name': wo.name, 'id': wo.id, 'state':wo.state} for wo in mo.workorder_ids]
            
            mo_data.append({
                'name': mo.name,
                'id' :mo.id,
                'progress_percentage': total_percentage,
                'wo_list': wo_list
            })
        return mo_data

    #for MO line chart for time efficiency
    @http.route('/dashboard/get_mo_efficiency', type='http', auth='user', website=True, csrf=False)
    def get_mo_efficiency(self, **kw):
        
        mos = request.env['mrp.production'].sudo().search([('state', '=', 'done')])
        efficiency_data = []
        for mo in mos:
            wo_done = mo.workorder_ids.filtered(lambda wo: wo.state == 'done')
            if not wo_done:
                continue
            duration = sum(wo.duration for wo in wo_done)
            duration_expected = sum(wo.duration_expected for wo in wo_done)
            efficiency = (duration_expected / duration) * 100 if duration else 0
            efficiency_data.append({
                'name': mo.name,
                'duration': duration,
                'duration_expected': duration_expected,
                'efficiency': efficiency
            })
        return json.dumps({'efficiency_data': efficiency_data})   

    #for MO cost bar chart
    @http.route('/dashboard/get_mo_cost', type='http', auth='user', website=True, csrf=False)
    def get_mo_cost(self, **kw):
        
        mos = request.env['mrp.production'].sudo().search([('state', '=', 'done')])
        cost_data = []
        for mo in mos:
            analytic_lines = request.env['account.analytic.line'].sudo().search([('category', '=', 'manufacturing_order'), ('ref', '=', mo.name)])
            
            real_cost = sum(mc.amount for mc in analytic_lines)
             # Retrieve the BoM associated with the manufacturing order
            bom = mo.bom_id 
            bom_cost = sum(line.product_id.standard_price * line.product_qty for line in bom.bom_line_ids) 
            cost_efficiency = (bom_cost / real_cost) * 100 *-1 if real_cost else 0

            cost_data.append({
                'name': mo.name,
                'real_cost': real_cost*-1,
                'bom_cost': bom_cost,
                'cost_efficiency': cost_efficiency
            })
        return json.dumps({'cost_data': cost_data})   

    #for MO gantt chart
    @http.route('/dashboard/get_mo_progress', type='http', auth='user', website=True, csrf=False)
    def get_mo(self, **kw):
        
        mos = request.env['mrp.production'].search([('state', 'in', ['confirmed', 'progress'])])
        mo_data = []
        for mo in mos:
            total_percentage = sum(wo.operation_id.operation_percentage for wo in mo.workorder_ids if wo.state == 'done')
            wo_list = [{'name': wo.name, 'id': wo.id, 'state':wo.state} for wo in mo.workorder_ids]
            #we will use the fisrt started wo's date as mo start date
            #date_start= mo.workorder_ids.sorted(key=lambda w: w.date_start or datetime.now(), reverse=False)[0].date_start
            so = request.env['sale.order'].search([('name', '=', mo.origin)])

            mo_data.append({
                'name': mo.name,
                'id' :mo.id,
                #'date_start': date_start.strftime('%Y-%m-%d %H:%M:%S') if date_start else '',
                'date_start':mo.date_planned_start.strftime('%Y-%m-%d %H:%M:%S'),
                'date_end':mo.date_planned_finished.strftime('%Y-%m-%d %H:%M:%S'),
                'progress_percentage': total_percentage,
                'origin': mo.origin, 
                'commitment_date' : so.commitment_date.strftime('%Y-%m-%d %H:%M:%S') if so.commitment_date else '',
                'date_deadline' : mo.date_deadline.strftime('%Y-%m-%d %H:%M:%S')  if mo.date_deadline else '',
            })
        return json.dumps({'mo_data': mo_data})