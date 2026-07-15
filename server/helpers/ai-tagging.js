const _ = require('lodash')
const request = require('request-promise')

const DEFAULT_BASE_URL = 'https://api.openai.com/v1'
const DEFAULT_MODEL = 'gpt-5.6'

const normalizeBaseUrl = value => {
  const baseUrl = _.trim(value || DEFAULT_BASE_URL).replace(/\/+$/, '')
  return baseUrl || DEFAULT_BASE_URL
}

const getEndpoint = (baseUrl, path) => {
  return `${normalizeBaseUrl(baseUrl)}${path}`
}

const getConfig = config => {
  return {
    baseUrl: normalizeBaseUrl(_.get(config, 'aiTagging.baseUrl', process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL)),
    apiKey: _.get(config, 'aiTagging.apiKey') || process.env.OPENAI_API_KEY || '',
    model: _.get(config, 'aiTagging.model') || process.env.OPENAI_TAG_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL
  }
}

const assertProviderConfig = config => {
  if (!config.apiKey) {
    throw new Error('AI provider API Key is not configured.')
  }
  if (!config.model) {
    throw new Error('AI provider model is not configured.')
  }
}

const extractChatText = resp => {
  return _.get(resp, 'choices[0].message.content', '')
}

const parseJsonText = text => {
  const trimmed = _.trim(text)
  if (!trimmed) {
    throw new Error('AI provider returned an empty response.')
  }
  try {
    return JSON.parse(trimmed)
  } catch (err) {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (match) {
      return JSON.parse(match[0])
    }
    throw err
  }
}

const listModels = async ({ baseUrl, apiKey }) => {
  if (!apiKey) {
    throw new Error('API Key is required to detect models.')
  }

  const resp = await request({
    method: 'GET',
    uri: getEndpoint(baseUrl, '/models'),
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    json: true,
    timeout: 30000
  })

  return _.chain(resp.data || resp.models || [])
    .map(model => _.isString(model) ? model : model.id)
    .compact()
    .uniq()
    .sortBy()
    .value()
}

const createTagCompletion = async ({ baseUrl, apiKey, model, messages }) => {
  assertProviderConfig({ apiKey, model })
  const req = {
    method: 'POST',
    uri: getEndpoint(baseUrl, '/chat/completions'),
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: {
      model,
      messages,
      temperature: 0.2,
      response_format: {
        type: 'json_object'
      }
    },
    json: true,
    timeout: 30000
  }

  try {
    return await request(req)
  } catch (err) {
    const msg = `${err.message || ''} ${JSON.stringify(err.error || {})}`
    if (err.statusCode === 400 && /response_format/i.test(msg)) {
      delete req.body.response_format
      return request(req)
    }
    throw err
  }
}

module.exports = {
  DEFAULT_BASE_URL,
  DEFAULT_MODEL,
  getConfig,
  listModels,
  normalizeBaseUrl,
  parseJsonText,
  extractChatText,
  createTagCompletion
}
