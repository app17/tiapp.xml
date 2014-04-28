> **NOT YET FUNCTIONAL. API STILL IN DESIGN.**

# tiapp.xml [![Build Status](https://travis-ci.org/tonylukasavage/tiapp.xml.svg?branch=master)](https://travis-ci.org/tonylukasavage/tiapp.xml) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

A node.js parsing and manipulation API module for Appcelerator's [Titanium](http://www.appcelerator.com/titanium/) tiapp.xml configuration file.

## Examples

### Change the Titanium SDK version

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
tiapp.sdkVersion = '3.2.2.GA';
tiapp.write();
```

### Disable analytics

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
tiapp.analytics = false;
tiapp.write();
```

### Add a new native module for android

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
tiapp.setModule('com.tonylukasavage.someCoolModule', '1.0', 'android');
tiapp.write();
```

## API

* module APIs
	* [load](#loadfile)
	* [parse](#parsexmlstring-filename)
	* [find](#find)
* tiapp APIs
	* [write](#writefile)
	* [top-level elements](#top-level-elements)
	* [getDeploymentTarget](#getdeploymenttargetplatform)
	* [setDeploymentTarget](#setdeploymenttargetplatform-value)
	* [getProperty](#getpropertyname)
	* [setProperty](#setpropertyname-value-type)
	* [removeProperty](#removepropertyname)
	* [getModules](#getmodules)
	* [setModule](#setmoduleid-version-platform)
	* [removeModule](#removemoduleid-platform)
	* [getPlugins](#getplugins)
	* [setPlugin](#setpluginid-version)
	* [removePlugin](#removepluginid)

### load(file)

Load a tiapp.xml file and return a Tiapp object. If `file` is undefined, [find()](#find) will attempt to locate a tiapp.xml file.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
```

### parse(xmlString, filename)

Parse an xml string as a tiapp.xml document and return a Tiapp object. This is used by `load()` and generally isn't used directly. `filename` is optional, and is used only as a default value if you attempt to [write()](#writefile) later.

```js
var tiapp = require('tiapp.xml').parse('<ti:app><!-- the rest of the tiapp.xml --></ti:app>');
```

### find()

Find a tiapp.xml file and return its file path. It will start by searching the current working directory for a tiapp.xml file. If it doesn't find it, it will continue to move up the folder hierarchy attempting to find tiapp.xml files. If it never finds a tiapp.xml, it returns `null`.

```js
var pathToTiappXml = require('tiapp.xml').find();
```

### write([file])

Write the current Tiapp object out as a tiapp.xml file to `file`. If `file` is undefined, it will use the file supplied in the inital [load()](#loadfile) or [parse()](#parsexmlstring-filename) call. If it still can't find a file, an exception with be thrown.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');

// disable analytics
tiapp.analytics = false;

// write out the changes to "./tiapp.xml"
tiapp.write();

// or write out to an explicit location
tiapp.write('/path/to/tiapp.xml');
```

### top-level elements

Get and set [top-level tiapp.xml elements](http://docs.appcelerator.com/titanium/latest/#!/guide/tiapp.xml_and_timodule.xml_Reference-section-29004921_tiapp.xmlandtimodule.xmlReference-TopLevelElements) directly as properties. These properties can be referenced in dash form or camel case. For example, to work with the `sdk-version` you can use either `tiapp['sdk-version']` or `tiapp.sdkVersion`.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');

// prints the name and guid of the app
console.log(tiapp.name + ': ' + tiapp.guid);

// disable analytics
tiapp.analytics = false;

// change the sdk version
tiapp['sdk-version'] = '3.2.2.GA';
```

### getDeploymentTarget(platform)

Return a boolean indicating whether or not the given `platform` is enabled.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
console.log(tiapp.getDeploymentTarget('android'));
```

The previous code would print `true` if the `deployment-targets` section of your tiapp.xml looked something like this:

```xml
<deployment-targets>
	<target device="android">true</target>
</deployment-targets>
```

### setDeploymentTarget(platform, value)

Enable or disable a platform.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
tiapp.getDeploymentTarget('android', false);
tiapp.write();
```

The previous code would write a `deployment-targets` entry something like this:

```xml
<deployment-targets>
	<target device="android">false</target>
</deployment-targets>
```

### getProperty(name)

Get a tiapp.xml [application property](http://docs.appcelerator.com/titanium/latest/#!/guide/tiapp.xml_and_timodule.xml_Reference-section-29004921_tiapp.xmlandtimodule.xmlReference-ApplicationProperties) value.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
console.log(tiapp.getProperty('ti.ui.defaultunit')); // prints "system"
```

### setProperty(name, [value], [type])

Set a tiapp.xml [application property](http://docs.appcelerator.com/titanium/latest/#!/guide/tiapp.xml_and_timodule.xml_Reference-section-29004921_tiapp.xmlandtimodule.xmlReference-ApplicationProperties).

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');

// with just a value
tiapp.setProperty('ti.ui.defaultunit', 'dp');

// or with a value and type
tiapp.setProperty('ti.ui.defaultunit', 'dp', 'string');

tiapp.write();
```

### removeProperty(name)

Remove an [application property](http://docs.appcelerator.com/titanium/latest/#!/guide/tiapp.xml_and_timodule.xml_Reference-section-29004921_tiapp.xmlandtimodule.xmlReference-ApplicationProperties) from the tiapp.xml.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
tiapp.removeProperty('ti.ui.defaultunit');
tiapp.write();
```

### getModules()

Get an array of objects representing modules listed in the tiapp.xml.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
var modules = tiapp.getModules();

// iterate through a list of modules from the tiapp.xml
modules.forEach(function(mod) {
	// read access to properties on module object
	console.log('id=%s,version=%s,platform=%s',
		mod.id, mod.version || '<no version>', mod.platform || '<no platform>');
});
```

### setModule(id, [version], [platform])

Add or update a module in the tiapp.xml.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');

// Add the ti.cloud module
tiapp.setModule('ti.cloud');

// Set the version of ti.cloud to 2.0
tiapp.setModule('ti.cloud', '2.0');

// Add a platform-specific module
tiapp.setModule('ti.cloud', '1.0', 'android');

// Add one more module, no additional details
tiapp.setModule('com.tonylukasavage.nothing');

tiapp.write();
```

The resulting tiapp.xml `<modules>` section would look like this:

```xml
<modules>
	<module version="2.0">ti.cloud</module>
	<module version="1.0" platform="android">ti.cloud</module>
	<module>com.tonylukasavage.nothing</module>
</modules>
```

### removeModule(id, [platform])

Remove a module from the tiapp.xml.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');

// remove ti.cloud module that is _not_ platform-specific
tiapp.removeModule('ti.cloud');

// remove a platform-specific ti.cloud entry
tiapp.removeModule('ti.cloud', 'android');

tiapp.write();
```

### getPlugins()

Get an array of objects representing plugins listed in the tiapp.xml.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
var plugins = tiapp.getPlugins();

// iterate through a list of plugins from the tiapp.xml
plugins.forEach(function(plugin) {
	// read access to properties on plugin object
	console.log('id=%s,version=%s', plugin.id, plugin.version || '<no version>');
});
```

### setPlugin(id, [version])

Add or update a plugin in the tiapp.xml.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');

// Add the ti.alloy plugin
tiapp.setPlugin('ti.alloy');

// Set the version of ti.alloy to 2.0
tiapp.setModule('ti.alloy', '2.0');

tiapp.write();
```

The resulting tiapp.xml `<plugins>` section would look like this:

```xml
<plugins>
	<plugin version="2.0">ti.alloy</plugin>
</plugins>
```

### removePlugin(id)

Remove a plugin from the tiapp.xml.

```js
var tiapp = require('tiapp.xml').load('./tiapp.xml');
tiapp.removePlugin('ti.alloy');
tiapp.write();
```

## Todo

* Platform-specific tiapp.xml sections