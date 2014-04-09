var fs = require('fs'),
	path = require('path'),
	xmldom = require('xmldom');

module.exports = Tiapp;

// TODO: fix xmldom HTTP link once grunt-jsdoc supports jsdoc 3.3.0+ without error
/**
 * Creates a new Tiapp object
 * @constructor
 *
 * @param {String} [file=./tiapp.xml] Path to the tiapp.xml file
 *
 * @property {Object} doc XML document object, generated by {@link Tiapp#parse|parse()}. Generally you'll
 *                        use the Tiapp API and won't access this directly. If you need it, though, it is
 *                        available. Its usage can be found at https://github.com/jindw/xmldom.
 * @property {String} file Path to the tiapp.xml file. Setting `file` will call {@link Tiapp#parse|parse()}.
 */
function Tiapp(file) {
	var self = this,
		_file;

	// make sure file is either undefined or a string
	if (typeof file !== 'undefined' && !isString(file)) {
		throw new Error('Bad argument. If defined, file must be a string.');
	}

	// create getter/setter for file
	Object.defineProperty(this, 'file', {
		get: function() {
			return _file;
		},
		set: function(val) {
			_file = val;
			self.parse();
		}
	});

	// set file and parse, if found
	file = file || this.find();
	if (file) {
		this.file = file;
	}
}

/**
 * Parses the given file as a tiapp.xml file and updates the current Tiapp object.
 *
 * @param {String} [file=./tiapp.xml] Path to the tiapp.xml file
 */
Tiapp.prototype.parse = function parse(file) {
	// let the setter do its job
	if (file) {
		this.file = file;
		return;
	}

	// make sure we found a tiapp.xml, otherwise throw
	if (!this.file) {
		throw new Error('No tiapp.xml file found.');
	}

	// parse the file as xml
	this.doc = new xmldom.DOMParser().parseFromString(fs.readFileSync(this.file, 'utf8'));
};

/**
 * Determines the location of the tiapp.xml file. It will search the current directory,
 * and all other directories higher in the view hierarchy, in order. If it does not find
 * a tiapp.xml in any of these directories, null is returned.
 *
 * @returns {String|null} The location of the tiapp.xml file, or null if not found.
 */

Tiapp.prototype.find = function find() {
	var cwd = process.cwd(),
		parts = cwd.split(path.sep);

	for (var i = 1, len = parts.len; i <= len; i++) {
		var p = path.join.apply(null, parts.slice(0, len-i).concat('tiapp.xml'));
		console.log(p);
	}
};

function isString(o) {
	return Object.prototype.toString.call(o) === '[object String]';
}
