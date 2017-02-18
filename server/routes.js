'use strict';
const isProduction = process.env.PRODUCTION || false;
const objectId = require('mongodb').ObjectID;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Boom = require('boom');
const ReadableStream = require('stream').Readable;
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const Schemas = require('./schemas');

const GET = 'get';
const PATCH = 'patch';
const POST = 'post';

const PULSES = 'pulses';

const sanitizeUpdate = update => _.omit(update, ['_id', 'created_at', 'updated_at']);

const getValidation = (resource, method) => {
  switch (method) {
    case GET:
      return {
        query: {
          limit: Joi.number().integer(),
          page: Joi.number().integer(),
          pulse_ref: Joi.string(),
          board_ref: Joi.string(),
          ids: Joi.array().items(Joi.objectId()).single(),
        },
      };
    case PATCH:
      return {
        params: { id: Joi.objectId() },
        payload: Schemas[resource][method],
      };
    case POST:
      return { payload: Schemas[resource][method] };
    default:
      console.error('Unsupported method: ', method);
      return null;
  }
};

const ensureDBIndex = (db, collectionName, fieldName, options) => {
  console.log('Creating index on field', fieldName, 'in collection', collectionName,
    '. (options: ', options, ')');
  db.collection(collectionName).createIndex(fieldName, options, (error, result) => {
    if (error) {
      console.error('Failed creating index:', error);
    } else {
      console.log('Index created successfully.');
    }
  });
};

exports.register = (plugin, options, done) => {

  plugin.dependency('hapi-mongodb');

  const db = plugin.mongo.db;


  const getPulses = (queryOptions) => {

    const pulseCollection = db.collection(PULSES);
    return pulseCollection.find({}).toArray();
    // return pulseCollection.find({}, {updates: false}).toArray();
  };

  const insertDocument = (record, collectionName) => {
    const collection = db.collection(collectionName);
    _.assign(record, { created_at: new Date() });
    return collection.insert(record);
  };

  plugin.route({
    method: POST,
    path: `/${PULSES}`,
    handler: (request, reply) => insertDocument(request.payload, PULSES).then((res) => reply(res)),
    config: {
      validate: getValidation(PULSES, POST),
    },
  });

  plugin.route({
    method: GET,
    path: `/${PULSES}`,
    handler: (request, reply) => getPulses().then((res) => reply(res)),
    config: {
      // validate: getValidation(PULSES, GET),
      // plugins: { pagination: { defaults: { limit: routes[resource].maxPageSize } } },
    },
  });

  done();
}

exports.register.attributes = {
  name: 'Routes',
  version: '1.0.0',
};
