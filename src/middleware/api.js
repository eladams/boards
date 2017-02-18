import { normalize } from 'normalizr';
import 'isomorphic-fetch';
import _ from 'lodash';

const API_PORT = '8081';
const API_ROOT = window.location.port ? `http://${window.location.hostname}:${API_PORT}/` : process.env.API_ROOT;

function callApi(endpoint, schema, options) {
  const fullUrl = (endpoint.toLowerCase().indexOf('://') === -1) ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl, options)
  .then(response =>
    response.json().then(json => ({ json, response }))
  )
  .then(({ json, response }) => {
    if (!response.ok) {
      //handle errors
    }

    const result = normalize(json, schema);
    return _.assign({}, result);
  });
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');
export const root = API_ROOT;

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { schema, types, options, request, revert } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = _.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({
    type: requestType,
    request,
  }));

  return callApi(endpoint, schema, options).then(
    response => next(actionWith({
      type: successType,
      request,
      response,
    })),
    error => next(actionWith({
      type: failureType,
      error: error.error || error || 'Something went wrong',
      statusCode: error.statusCode,
      serverRequest: error.payload,
      request,
      revert,
    })),
  );
};
