/** @author VijayAnand Santhiyagu */
/*  Logger Utility */
/* This library helps for advanced logging */
/* Configuration can also can be done */

/** For best practices, we will be using this service, instead of console.log
  * @example logger.log("loglevel", "logcategory", logmsg, [logmsgs][..])
  *  @param {loglevels} - all, none, log, debug, info, warning, error
  *   logLevels have this precedence
  *  		log - error, warning, debug, info, log
			debug - error, warning, info, log
			info - error, warning, info
			warning - error, warning
			error - error
  *
  *  @param {logTypes} - It is set in the config object, for example: mongo, sockets, etc.,
  *  @param {logmsg} - Message to be printed, string, object, array, int
  */

/** Configure this variable if you want to have your custom config */
(function(){ 

	var logConfig;

	if ((typeof logConfig == 'undefined') || !logConfig.hasOwnProperty('enableLog')) {
		// Set the default log configuration, if it is not available globally
		logConfig = {
			enableLog: true,
			logTypes: {
				//all: true,
				none: false,
				sockets: "debug",
				app: "all"
			}
		};
	}

	/** This variable is the local object reference, which has functions,
	  * only required functions will be bound to global reference
	  */
	var _this = {};

	/* Define the style for each layer in the output */
	var _style = {
		timestamp: 'color:green',
	 	level: null,
	 	category: 'color:#B30BF9; font-style:oblique',
	 	message: 'color: black'
	};


	_this.levels = ["all", "log", "debug", "info", "warning", "error", "none"];
	_this.logTypes = {all: true, none: false};

	var getTime = function () {
		var today = new Date();
		var datetime =  today.getDate() + "/" 
						+ (today.getMonth() + 1) + "/"
						+ today.getFullYear() + " "
						+ today.getHours() + ":"
						+ today.getMinutes() + ":"
						+ today.getSeconds(); 
		return datetime;
	};

	var getFormattedParams = function (args) {
		var params = [], i;
		params.push("" + getTime() + " - ");
		params.push("[" + args[0] + "]");
		params.push(args[1]);

		/* Format the output */
		// Internet explorer don't support %c, i.e user defined styles in the console
		if (isColorSupported()) {
			// String specifies how to format the console output
			// String  Color String  Color String   String
			params.splice(0, 0, "%c%s %c%s %c%s %c "); 

			params.splice(1, 0, _style.timestamp);

			params.splice(3, 0, _style.level);

			params.splice(5, 0, _style.category);

			params.splice(7, 0, _style.message);
		}

		if (args && (args.length > 2)) {
			for (i = 2; i < args.length; i++) {
				params.push(args[i]);
			}
		}
		return params;
	};
	var shouldLog = function (level, category) {

		/* _this in the document always refer to the logger library object */
		if (_this.logTypes["none"]) {
			return false;
		}

		if (_this.logTypes["all"]) {
			return true;
		}

		var requestLevel = _this.levels.indexOf(level);
		var minLevel = _this.levels.indexOf(_this.logTypes[category]);

		if (requestLevel == -1 || minLevel == -1) {
			return false;
		}

		if (requestLevel >= minLevel) {
			return true;
		} else {
			return false;
		}
	};

	var __toObject = function(value) {
		if (value == null) throw TypeError();
		return Object(value);
	};

	var setlogTypes = function(logTypes) {
		_this.logTypes = logTypes;
	};

	var getlogTypes = function() {
		return _this.logTypes;
	};

	var enable = function (enable) {
		_this.logTypes["none"] = ! enable;
	};

	var log = function () {
		if (shouldLog(arguments[0], arguments[1])) {
			if (arguments[0] == "error") {
				_style.level = "font-weight: bold; color: red";
				_this._error.apply(_this, arguments);
			}
			else if (arguments[0] == "warning") {
				_style.level = "color: red";
				_this._warn.apply(_this, arguments);
			}
			else if (arguments[0] == "debug") {
				_style.level = "color: #777978";
				_this._debug.apply(_this, arguments);
			}
			else if (arguments[0] == "info") {
				_style.level = "color: magenta";
				_this._info.apply(_this, arguments);
			}
			else if (arguments[0] == "log") {
				_style.level = "color: grey";
				_this._log.apply(_this, arguments);
			}
		}
	}

	_this._jsonStringify = function(obj) {
			var jsonString = "";
			try {
				jsonString = JSON.stringify(arguments);
			}
			catch(err) {
				jsonString = "Failed to stringify. Debuging in this browser is not recommended";
			}
			return jsonString;
	};

	_this._error = function () {
		if (console.error['apply']) {
			console.error.apply(console, getFormattedParams(arguments));
		} else {
			console.error(_this._jsonStringify(arguments));
		}
	};

	_this._log = function () {
		if (console.log['apply']) {
			console.log.apply(console, getFormattedParams(arguments));
		} else {
			console.log(_this._jsonStringify(arguments));
		}
	};

	_this._warn = function () {
		if (console.warn['apply']) {
			console.warn.apply(console, getFormattedParams(arguments));
		} else {
			console.warn(_this._jsonStringify(arguments));
		}
	};

	_this._info = function () {
		if (!console.info)
			console.info = console.log;
		if (console.info['apply']) {
			console.info.apply(console, getFormattedParams(arguments));
		} else {
			console.info(_this._jsonStringify(arguments));
		}
	};

	_this._debug = function () {
		if (!console.debug)
			console.debug = console.log;
		if (console.debug['apply']) {
			console.debug.apply(console, getFormattedParams(arguments));
		} else {
			console.debug(_this._jsonStringify(arguments));
		}
	};

	var isColorSupported = function() {
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");

		if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			// Internet explorer browser, so color is not supported
			return false;
		} else {
			return true;
		}
	};


	enable(logConfig.enableLog); // Don't show logs if configuration prohibits
	setlogTypes(logConfig.logTypes);

	window.logger = {
		enable: enable,
		setlogTypes: setlogTypes,
		getlogTypes: getlogTypes,
		log: log
	};

})();