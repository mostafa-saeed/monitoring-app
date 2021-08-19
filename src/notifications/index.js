import consoleNotification from "./console.notification.js";

export default {
  registeredNotifications: [consoleNotification],

  async sendNotifications(checks) {
    for (const registeredNotification of this.registeredNotifications) {
      const notificationChecks = checks.filter((check) => registeredNotification.condition(check));
      await Promise.all(
        notificationChecks.map((check) => registeredNotification.handler(check, check.responses[0].status)),
      );
    }
  },
};
