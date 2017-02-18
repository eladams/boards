import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { routerReducer } from 'react-router-redux';


// Updates an entity cache in response to any action with response.entities.
function entities(state = {
  pulses: {},
}, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }
  return state;
}

function loading(state = {
  pulses: null,
}, action) {
  console.log({action});
  // Suggest other solution for that:
  if (action.type.endsWith('REQUEST')) {
    return merge({}, state, {
      [action.type.split('_')[0].toLowerCase()]: true
    });
  }

  if (action.type.endsWith('SUCCESS') || action.type.endsWith('FAILURE')) {
    return merge({}, state, {
      [action.type.split('_')[0].toLowerCase()]: false,
    });
  }

  return state;
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action;
  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return action.error;
  }

  return state;
}

function selectedPulseId(state = null, action) { //defines the name of the state key
  switch (action.type) {
    case ActionTypes.SELECT_PULSE:
      return action.selectedPulseId;
    default: // no selection
      return state;
  }
}

const appReducer = combineReducers({
  loading,
  entities,
  errorMessage,
  selectedPulseId,
  routing: routerReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') { // simulate logout to clean state.
    const { routing } = state;
    return appReducer({ routing }, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
