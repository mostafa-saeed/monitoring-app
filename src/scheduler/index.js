import { scheduleJob } from 'node-schedule';
import { dispatchRequests } from '../requestor/index.js';
import checksService from '../checks/checks.service.js';
import responsesService from '../responses/responses.service.js';

const RUN_EVERY_MINUTE_PATTERN = '0 * * * * *';

export const start = () => {
  scheduleJob(RUN_EVERY_MINUTE_PATTERN, async () => {
    // Fetch checks
    const checks = await checksService.findReady();
    
    // Dispatch requests
    const responses = await dispatchRequests(checks);
  
    // Insert responses
    await responsesService.addResponses(checks, responses);
    // Update checks & reports
  
    // Notify
  });
};
