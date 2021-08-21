import { log } from 'console';

import { scheduleJob } from 'node-schedule';
import dispatchRequests from '../requestor/index.js';
import checksService from '../checks/checks.service.js';
import responsesService from '../responses/responses.service.js';
import notifier from '../notifications/index.js';

// const RUN_EVERY_FIVE_SECONDS_PATTERN = '*/5 * * * * *';
const RUN_EVERY_MINUTE_PATTERN = '0 * * * * *';

export default () => {
  scheduleJob(RUN_EVERY_MINUTE_PATTERN, async () => {
    const time = new Date();
    time.setMilliseconds(0);
    log('Scheduler started:', time);
    // Fetch checks
    const checks = await checksService.findReady(time);

    // Dispatch requests
    const responses = await dispatchRequests(checks);

    // Insert responses
    await responsesService.addResponses(responses);

    // Update checks nextCheck
    await checksService.setNextCheck(checks, time);

    // Get the checks that passed the threshold
    const changedChecks = await checksService.updateChangedChecks(checks, responses);
    // Notify changed checks
    await notifier.sendNotifications(changedChecks);
    log('All notifications are sent!');
  });
};
