import axios from 'axios';

const { SEND_GRID_TOKEN, SEND_GRID_FROM, SEND_GRID_NAME } = process.env;

export default {
  condition(check) {
    return check.user?.emailNotification;
  },

  handler(check, newStatus) {
    return axios({
      method: 'post',
      url: 'https://api.sendgrid.com/v3/mail/send',
      data: {
        personalizations: [
          {
            to: [
              {
                email: check.user.email,
              },
            ],
          },
        ],
        from: {
          email: SEND_GRID_FROM,
          name: SEND_GRID_NAME,
        },
        subject: `${check.name} status has changed to ${newStatus}`,
        content: [
          {
            type: 'text/html',
            value: `${check.name} status has changed to ${newStatus}`,
          },
        ],
      },
      headers: {
        Authorization: `Bearer ${SEND_GRID_TOKEN}`,
      },
    });
  },
};
