from odoo import models
import logging

_logger = logging.getLogger(__name__)

class NotificationService(models.AbstractModel):
    _name = 'notification.service'

    def send_notification(self, recipient_ids, subject, message):
        # Send notification to recipients
        
        self.env['mail.message'].sudo().create({
            'model': 'res.users',
            'res_id': self.env.user.id,
            'partner_ids': [(6, 0, recipient_ids)],
            'subject': subject,
            'body': message,
            'message_type': 'notification',
            'subtype_id': self.env.ref('mail.mt_comment').id,
        })
        _logger.info("###############################################%s###########%s###########",subject,recipient_ids)
        return True
