import consoleNotification from './console.notification.js';
import webhookNotification from './webhook.notification.js';
import emailNotification from './email.notification.js';

export default {
  registeredNotifications: [
    consoleNotification, webhookNotification, emailNotification,
  ],

  promises: [],

  async sendNotifications(checks) {
    this.promises = [];
    this.registeredNotifications.forEach((notification) => {
      const matchedChecks = checks.filter((check) => notification.condition(check));
      const promises = matchedChecks.map((check) => notification.handler(
        check, check.responses[0].status,
      ));
      this.promises = [].concat(this.promises, promises);
    });

    await Promise.allSettled(this.promises);
  },
};
