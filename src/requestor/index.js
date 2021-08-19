import https from 'https';
import axios from 'axios';

const PROMISE_STATUSES = {
  fulfilled: 'up',
  rejected: 'down',
};

const ALLOW_UNAUTHORIZED_SSL_AGENT = new https.Agent({
  rejectUnauthorized: false,
});

axios.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date() };
  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use((response) => {
  response.config.metadata.endTime = new Date();
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
  return response;
}, (error) => {
  error.config.metadata.endTime = new Date();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});

const createRequestOptions = (check) => {
  const options = {
    url: check.fullURL,
    timeout: check.timeout * 1000,
  };

  if (check.authentication) {
    options.auth = check.authentication;
  }

  if (check.additionalHeaders) {
    options.headers = check.additionalHeaders;
  }

  if (check.ignoreSSL) {
    options.httpsAgent = ALLOW_UNAUTHORIZED_SSL_AGENT;
  }

  return options;
};

const getResponse = (promiseResult) => (promiseResult.status === 'fulfilled'
  ? {
    response: promiseResult.value.data,
    duration: promiseResult.value.duration,
  } : {
    response: promiseResult.reason.response?.data || promiseResult.reason.message,
    duration: promiseResult.reason.duration,
  });

export default async (checks) => {
  const promisesResults = await Promise.allSettled(
    checks.map((check) => axios(createRequestOptions(check))),
  );

  return checks.map((check, index) => ({
    status: PROMISE_STATUSES[promisesResults[index].status],
    check,
    ...getResponse(promisesResults[index]),
  }));
};
