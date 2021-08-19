import mongoose from 'mongoose';
import Responses from './schemas/response.schema.js';

export default {

  addResponses(responses) {
    return Responses.insertMany(responses);
  },

  getReport(checkId) {
    return Responses.aggregate([
      // Find all the responses for this id
      { $match: { check: mongoose.Types.ObjectId(checkId) } },
      // I might consider limiting the results
      // Group the responses in order to aggregate their data
      {
        $group: {
          _id: '$check',
          responseTime: {
            $avg: '$duration',
          },
          checks: {
            $sum: 1,
          },
          upCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'up'] },
                1,
                0,
              ],
            },
          },
          downCount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'down'] },
                1,
                0,
              ],
            },
          },
          history: {
            $push: '$$ROOT',
          },
        },
      },
      // Lookup for the check to get the interval
      {
        $lookup: {
          from: 'checks',
          localField: '_id',
          foreignField: '_id',
          as: 'checkObject',
        },
      },
      { $unwind: '$checkObject' },

      // Add some calculated fields
      {
        $addFields: {
          availability: {
            $multiply: [
              { $divide: ['$upCount', '$checks'] },
              100,
            ],
          },
          status: '$checkObject.status',
          uptime: {
            $multiply: ['$upCount', '$checkObject.interval', 60],
          },
          downtime: {
            $multiply: ['$downCount', '$checkObject.interval', 60],
          },
        },
      },
    ]);
  },
};
