import Mongoose from 'mongoose';
import Checks from './schemas/check.schema.js';

const MILLISECONDS_IN_MINUTE = 60_000;

const DEFAULT_CHECK_OPTIONS = {
  timeout: 5,
  interval: 10,
  threshold: 1,
};

export default {
  create(check) {
    check = Object.assign({}, DEFAULT_CHECK_OPTIONS, check);
    check.nextCheck = Date.now() + check.interval * MILLISECONDS_IN_MINUTE;
    return Checks.create(check);
  },

  findById(id) {
    return Checks.findById(id);
  },

  findByUser(userId) {
    return Checks.find({ user: userId });
  },

  findReady(time) {
    return Checks.find({
      isActive: true,
      nextCheck: { $lte: time },
    });
  },

  setNextCheck(checks, time) {
    const ids = checks.map((check) => Mongoose.Types.ObjectId(check._id));
    return Checks.updateMany(
      { _id: { $in: ids } },
      [
        {
          $set: {
            nextCheck: {
              $toDate: {
                $add: [
                  time, {
                    $multiply: ['$interval', MILLISECONDS_IN_MINUTE],
                  }
                ]
              }
            }
          },
        }
      ]
    );
  },

  getChangedChecks(checks, responses) {
    return checks.filter((check, index) => check.status !== responses[index].status);
  },

  async getChecksResponses(checks) {
    const ids = checks.map((check) => Mongoose.Types.ObjectId(check._id));
    const checksResponses = await Checks.aggregate([
      { $match: { _id: { $in: ids } } },
      {
        $lookup: {
          from: 'responses',
          let: { checkId: '$_id', threshold: '$threshold' },
          pipeline: [
            { $match: { $expr: { $eq: ['$check', '$$checkId'] } } },
            { $sort: { _id: -1 } },
            // { $limit: '$$threshold' },
          ],
          as: 'responses',
        }
      }
    ]);

    // Trunc checks' responses
    return checksResponses.map((check) => {
      check.responses = check.responses.slice(0, check.threshold);
      return check;
    });
  },

  getPassedThresholdChecks(checksResponses) {
    // Filter
    return checksResponses.filter((check) => {
      // Get array of 'up' || 'down'
      const responses = check.responses.map((response) => response.status);
      // Get array unique values
      const uniqueResponses = [...new Set(responses)];
      // 1 response in the array means that the check threshold has been passed
      return uniqueResponses.length === 1;
    });
  },

  inverseChecksStatus(checks) {
    const ids = checks.map((check) => Mongoose.Types.ObjectId(check._id));
    return Checks.updateMany({
      _id: { $in: ids },
    }, [{
      $set: {
        status: {
          $cond: [
            { $eq: ['$status', 'up'] },
            'down',
            'up'
          ]
        }
      },
    }]);
  },

  async updateChangedChecks(checks, responses) {
    const changedChecks = this.getChangedChecks(checks, responses);
    const checksResponses = await this.getChecksResponses(changedChecks);
    const passedThresholdChecks = this.getPassedThresholdChecks(checksResponses);
    // Set 'up' to 'down' and vice-versa
    await this.inverseChecksStatus(passedThresholdChecks);

    return passedThresholdChecks;
  },
};
