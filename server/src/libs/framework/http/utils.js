import _ from 'lodash';
import util from 'util';
import uaParser from 'ua-parser-js';

export const getParams = function(request) {
  let params = _.extend({}, request.params || {}, request.query || {}, request.body || {}),
    { filter, page, sortBy, descending, rowsPerPage } = params,
    limit = Number((rowsPerPage * 1) || PAGE_SIZE),
    offset = (((page * 1) || 1) - 1) * limit,
    sort = {};

  if (sortBy) {
    sort[sortBy] = (String(descending) === 'true') ? 1 : -1;
  }
  if (rowsPerPage) {
    params.pagination = { limit, offset, sort, filter };
  }
  if (request.files) {
	let fileParams = _.groupBy(request.files, 'fieldname');
    params = { ...params, ...fileParams };
  }
  return params;
}

export const getCurrentUser = function(request) {
	return _.get(request, 'user');
}

export const getAddress = function(request) {
	return _.get(request, 'headers.x-forwarded-for', '')
		|| _.get(request, 'socket.remoteAddress', '')
		|| _.get(request, 'connection.remoteAddress', '')
		|| _.get(request, 'ip', '')
		|| '';
}

export const getUserAgent = function(request) {
	return _.get(request, 'headers.user-agent', '');
}

export const getProtocol = function(request) {
  return _.get(request, 'protocol', '');
}

export const getUserAgentText = function(request) {
	let ua = uaParser(getUserAgent(request)),
    device = _.trim(`${_.get(ua, 'device.vendor') || ''} ${_.get(ua, 'device.model') || ''} ${_.get(ua, 'device.type') || ''}`);

	return _.trim(util.format(
		'%s %s (%s %s %s) %s',
		_.get(ua, 'browser.name', ''),
		_.get(ua, 'browser.version', ''),
		_.get(ua, 'os.name', ''),
		_.get(ua, 'os.version', ''),
    _.get(ua, 'cpu.architecture', ''),
    device
	));
}

export const getLastAccess = function(request) {
	return {
		lastAccess: {
			address: getAddress(request),
      protocol: getProtocol(request),
			userAgent: getUserAgent(request),
			navigator: getUserAgentText(request),
			date: new Date()
		}
	};
}
