//import * as Joi from 'Joi';
//import convert from '../src/index';
//import assert from 'assert';

var Joi = require('joi'),
    convert = require('../src/index'),
    assert = require('assert');

suite('convert', function () {

  test('object defaults', function () {
    assert.deepEqual(convert(Joi.object()), {
      type: 'object',
      properties: {},
      additionalProperties: false
    });
  });

  test('object description', function () {
    assert.deepEqual(convert(Joi.object().description('woot')), {
      type: 'object',
      properties: {},
      additionalProperties: false,
      description: 'woot'
    });
  });

  test('object allow unknown', function () {
    assert.deepEqual(convert(Joi.object().unknown(true)), {
      type: 'object',
      properties: {},
      additionalProperties: true
    });
  });

  test('object', function () {
    let obj = Joi.object().keys({
      string: Joi.string(),
      'string default': Joi.string().default('bar').description('bar desc'),
      'number': Joi.number(),
      'boolean required': Joi.boolean().required()
    });

    assert.deepEqual(convert(obj), {
      type: 'object',
      required: ['boolean required'],
      properties: {
        'string': {
          type: 'string'
        },
        'string default': {
          type: 'string',
          "default": 'bar',
          description: 'bar desc'
        },
        'number': {
          type: 'number'
        },
        'boolean required': {
          type: 'boolean'
        }
      },
      additionalProperties: false
    });
  });

  test('type: array', function () {
    assert.deepEqual(convert(Joi.array()), {
      type: 'array'
    });
  });

  test('enum', function () {
    assert.deepEqual(convert(Joi.string().valid(['a', 'b'])), {
      type: 'string',
      "enum": ['a', 'b']
    });
  });

  test('alternatives -> oneOf', function () {
    let joi = Joi.object().keys({
      value: Joi.alternatives().try(
          Joi.string().valid('a'),
          Joi.number().valid(100)
      )
    });

    assert.deepEqual(convert(joi), {
      type: 'object',
      additionalProperties: false,
      properties: {
        value: {
          oneOf: [
            {
              type: 'string',
              "enum": ['a']
            },
            {
              type: 'number',
              "enum": [100]
            }
          ]
        }
      }
    });
  });

  test('string min/max', function () {
    assert.deepEqual(convert(Joi.string().min(5).max(100)), {
      type: 'string',
      minLength: 5,
      maxLength: 100
    });
  });

  test('string -> maxLength', function () {
    assert.deepEqual(convert(Joi.string().length(5)), {
      type: 'string',
      maxLength: 5,
      minLength: 5
    });
  });

  test('string email', function () {
    assert.deepEqual(convert(Joi.string().email()), {
      type: 'string',
      format: 'email'
    });
  });

  test('date', function () {
    assert.deepEqual(convert(Joi.date()), {
      type: 'string',
      format: 'date-time'
    });
  });

  test('string regex -> pattern', function () {
    let joi = Joi.string().regex(/^[a-z]$/);
    assert.deepEqual(convert(joi), {
      type: 'string',
      pattern: '^[a-z]$'
    });
  });

  test('number min/max', function () {
    let joi = Joi.number().min(0).max(100);
    assert.deepEqual(convert(joi), {
      type: 'number',
      minimum: 0,
      maximum: 100
    });
  });

  test('number greater/less', function () {
    let joi = Joi.number().greater(0).less(100);
    assert.deepEqual(convert(joi), {
      type: 'number',
      minimum: 0,
      exclusiveMinimum: true,
      maximum: 100,
      exclusiveMaximum: true
    });
  });

  test('integer', function () {
    assert.deepEqual(convert(Joi.number().integer()), {
      type: 'integer'
    });
  });

  test('array min/max', function () {
    let joi = Joi.array().min(5).max(100);
    assert.deepEqual(convert(joi), {
      type: 'array',
      minItems: 5,
      maxItems: 100
    });
  });

  test('array length', function () {
    let joi = Joi.array().length(100);
    assert.deepEqual(convert(joi), {
      type: 'array',
      minItems: 100,
      maxItems: 100
    });
  });

  test('array unique', function () {
    let joi = Joi.array().unique();
    assert.deepEqual(convert(joi), {
      type: 'array',
      uniqueItems: true
    });
  });

  test('array inclusions', function () {
    let joi = Joi.array().includes(Joi.string());
    assert.deepEqual(convert(joi), {
      type: 'array',
      items: [{type: 'string'}]
    });
  });

  test('joi any', function () {
    let joi = Joi.any();
    assert.deepEqual(convert(joi), {
      type: ['array', 'boolean', 'number', 'object', 'string', 'null']
    });
  });

  test('big and complicated', function () {

    var joi = Joi.object({
          aFormattedString: Joi.string().regex(/^[ABC]_\w+$/),
          aFloat: Joi.number().default(0.8).min(0.0).max(1.0),
          anInt: Joi.number().required().precision(0).greater(0),
          anArrayOfFloats: Joi.array().includes(Joi.number().default(0.8).min(0.0).max(1.0)),
          anArrayOfNumbersOrStrings: Joi.array().includes(Joi.alternatives(Joi.number(), Joi.string()))
        }),
        expected = {
          type: 'object',
          properties: {
            aFormattedString: {
              type: 'string',
              pattern: '^[ABC]_\\w+$'
            },
            aFloat: {
              default: 0.8,
              type: 'number',
              minimum: 0,
              maximum: 1
            },
            anInt: {
              type: 'number',
              exclusiveMinimum: true,
              minimum: 0
            },
            anArrayOfFloats: {
              type: 'array',
              items: [
                {
                  default: 0.8,
                  type: 'number',
                  minimum: 0,
                  maximum: 1
                }
              ]
            },
            anArrayOfNumbersOrStrings: {
              type: 'array',
              items: [{oneOf: [{type: 'number'}, {type: 'string'}]}]
            }
          },
          additionalProperties: false,
          required: ['anInt']
        };
    assert.deepEqual(convert(joi),expected);
  });

});
