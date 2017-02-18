import { CALL_API, Schemas } from '../middleware/api';
import { schema } from 'normalizr';
// import { push } from 'react-router-redux';
const _ = require('lodash');

export const SELECT_PULSE = 'SELECT_PULSE'

export function selectPulse(selectedPulseId) {
  return {
    type: SELECT_PULSE,
    selectedPulseId,
  };
}


const genericSchema = type => new schema.Entity(type.toLowerCase(), {}, { idAttribute: '_id' });
const genericArraySchema = type => new schema.Array(genericSchema(type));

export function getEntityActionTypes(entityName) {
  return [
    `${entityName.toUpperCase()}_REQUEST`,
    `${entityName.toUpperCase()}_SUCCESS`,
    `${entityName.toUpperCase()}_FAILURE`,
  ];
}

export function getEntityRequestType(entityName) {
  return getEntityActionTypes(entityName)[0];
}

export function getEntitySuccessType(entityName) {
  return getEntityActionTypes(entityName)[1];
}

export function getEntityFailureType(entityName) {
  return getEntityActionTypes(entityName)[2];
}

function fetchEntities(type, endpointUrl) {
  return {
    [CALL_API]: {
      types: getEntityActionTypes(type),
      endpoint: endpointUrl,
      schema: genericArraySchema(type),
    },
  };
}

export function loadEntities(entityName, options) {
  return (dispatch, getState) => {
    return dispatch(fetchEntities(entityName, 'pulses'));
  };
}


export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE,
  };
}
