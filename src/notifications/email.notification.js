import sendEmail from '../common/sendgrid.service.js';

export default {
  condition(check) {
    return check.user?.emailNotification;
  },

  handler(check, newStatus) {
    return sendEmail(
      check.user.email,
      `${check.name} status has changed to ${newStatus}`,
      `${check.name} status has changed to ${newStatus}`,
    );
  },
};
