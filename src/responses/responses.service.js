import mongoose from 'mongoose';
import Responses from './schemas/response.schema.js';

const STATUSES = {
  fulfilled: 'up',
  rejected: 'down',
};

export default {
  getResponse(promiseResult) {
    return promiseResult.status === 'fulfilled' ?
      {
        response: promiseResult.value.data,
        duration: promiseResult.value.duration,
      } : {
        response: promiseResult.reason.response ? promiseResult.reason.response.data : promiseResult.reason.message,
        duration: promiseResult.reason.duration,
      };
  },

  addResponses(checks, promiseResult) {
    // Merge data
    const responses = checks.map((check, index) => ({
      status: STATUSES[promiseResult[index].status],
      check,
      ...this.getResponse(promiseResult[index]),
    }));

    return Responses.insertMany(responses);
  },

  getReport(checkId) {
    return Responses.aggregate([
      // Find all the responses for this id
      { $match: { check: mongoose.Types.ObjectId(checkId) } },
      // Group the responses in order to aggregate their data
      {
        $group: {
          _id: '$check',
          responseTime: {
            $avg: '$duration'
          },
          checks: {
            $sum: 1
          },
          upCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'up'] },
                1,
                0
              ]
            }
          },
          downCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'down'] },
                1,
                0
              ]
            }
          },
          history: {
            $push: '$$ROOT'
          }
        }
      },
      // Lookup for the check to get the interval
      {
        $lookup: {
          from: 'checks',
          localField: '_id',
          foreignField: '_id',
          as: 'checkObject'
        }
      },
      { $unwind: '$checkObject' },

      // Add some calculated fields
      {
        $addFields: {
          availability: {
            $multiply: [
              {$divide: ['$upCount', '$checks']},
              100
              ]
          },
          uptime: {
            $multiply: ['$upCount', '$checkObject.interval', 60]
          },
          downtime: {
            $multiply: ['$downCount', '$checkObject.interval', 60]
          },
        }
      },
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $eq: ['$availability', 100] }, then: 'Always up' },
                { case: { $eq: ['$availability', 0] }, then: 'Always down' },
              ],
              default: 'Not always up'
            }
          },
        }
      },
    ]);
  }
};
