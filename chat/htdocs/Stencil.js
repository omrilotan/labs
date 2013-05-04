/*!
 * Stencil JavaScript Templating Engine
 * Version: 5
 * Last modified (Y,M,D): 2013-04-18
 * Documentation: http://stenciljs.org
 */

// prototype patches
(function () {
    // String trim
    if (typeof String.prototype.trim !== "function") {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "");
        };
    }
    // Object hasOwnProperty
    if (typeof Object.prototype.hasOwnProperty !== "function") {
        Object.prototype.hasOwnProperty = function (property) {
            var _prototype = this.__proto__ || this.constructor.prototype;
            return (property in this) && (!(property in _prototype) ||
                    _prototype[property] !== this[property]);
        };
    }
}());

(function (win, namespace, undefined) {
    "use strict";

        // Set up global constants
    var constants = {

            // attribute to search for template objects in the HTML file
            DOM_QUERY_ATTRIBUTE: "template-name",

            // script type to search for template strings on the page
            SCRIPT_QUERY_NAME: "text/templates"
        },
        //////////////////////
        // Global functions //
        //////////////////////

        // PATCH: try to setAttribute when it fails
        // on rare occasions where the prototype was corrupted
        setAttribute = function (node, name, value) {
            if (typeof node.setAttribute === "function") {
                node.setAttribute(value);
            } else if (typeof Element.prototype.setAttribute === "function") {
                
                // try prototype functionality directly
                Element.prototype.setAttribute.call(node, name, value);
            } else if (typeof node[name] === "string") {
                node[name] = value;
            } else {
                switch (name.toLowerCase()) {
                    
                    // exceptions
                    case "class":
                    case "classname":
                        node.className = value;
                        break;
                    case "style":
                        var styles = value,
                            array = styles.split(";"),
                            pair,
                            n;
                        while (n--) {
                            pair = array[n].split(":");
                            node.style[pair[0]] = pair[1];
                        }
                        break;
                    // no default
                }
            }
             return;    // undefined
        },

        // remove curly brackets and 0 or more white spaces
        cleanString = function (string) {
            return typeof string === "string" ? string.replace(/\{\{\s*|\s*\}\}/gmi, "") : "";
        },

        retrieveString = function (item) {

            // return item.text or item.innerHTML or "" empty string
            return (typeof item.text === "string" ? item.text : false) ||
                    (typeof item.innerHTML === "string" ? item.innerHTML : "");
        },

        // retrieve a data member from strings representing objects
        // or return an object from the the scope chain (up to the global scope)
        resolveDotNotation = function (string, context) {
            
            // handle bad arguments
            if (typeof string !== "string") {
                
                // not a string, return object or null
                return typeof string === "object" ? string : null;
            }
            
            // if the context argument is missing, context is the global object
            context = typeof context === "object" ? context : win;
            
                // separate the dots (.) and create an array
            var array = string.trim().split("."),
                object = context,    // object transforms through iteration
                i = 0,
                len = array.length;
                
            // iterate over the dot notation members array
            for (; i < len; i++) {
                if (typeof object === "object") {
                    object = object[array[i]];    // look for next item in object iterator
                } else if (context !== win) {
                    
                    // search failed, go search in global scope
                    return resolveDotNotation(string);    // this recursion will only happen once
                } else {
                    
                    // was not found in the context or window
                    return null;    // undefined
                }
            }
            return object != null ? object : null;    // convert the operands
        },

        getOptions = function (context) {
            return typeof context === "object" &&
                    typeof context.options === "object" ? context.options : {};
        },

        // find and replace within a string:
        // keys wrapped with double curly brackets and 0 or more white spaces
        findAndReplaceKeys = function (string, dataitem) {
            var array,
                key,
                regex,
                i,
                len,
                start,
                end,
                stringToReplace,
                options = getOptions(this);

            // if there are any matches
            if (pattern().test(string) && typeof dataitem === "object") {
                array = string.match(/(\{\{.*?\}\})/gmi);    // array of matches {{XXX}}

                // if we might need to evaluate code
                if (options.evaluate === true &&
                        /\(.*\)/gmi.test(string)) {    // check for parentheses ()

                    i = 0,
                    len = array.length;

                    // iterate respectively to the array
                    for (; i < len; i++) {
                        start = string.indexOf('{{');    // find first "{{"
                        end = string.indexOf('}}', start);    // find next "}}"
                        
                        // first key appearance
                        stringToReplace = string.substr(start, end + 2 - start);
                        string = string.replace(stringToReplace, getValue.call(this, null, cleanString(array[i]), dataitem));
                    }
                } else {

                    // use a cheaper way if we definitely won't need evaluation
                    i = array.length;
                    while (i--) {
                        key = cleanString(array[i]);
                        
                        // replace within the string
                        regex = new RegExp("\\{{( )*" + key + "( )*\\}}", "gmi");
                        string = string.replace(regex, resolveDotNotation(key, dataitem));
                    }
                }
            }
            return string;
        },

        // get value for extension attribute values
        getValue = function (node, value, dataitem) {
            var returnValue = resolveDotNotation(cleanString(value), dataitem),
                valueAsAFunction,
                options = getOptions(this);
            if (returnValue !== undefined && returnValue !== null) {
                return returnValue;
            }
            if (options.evaluate === true &&
                    /\(.*\)/gmi.test(value)) {    // check for parentheses ()
                try {                        
                    // try to run the text as javascript function's body
                    // introduce two arguments: $dataitem and $element
                    // 'this' is null in the function's context
                    valueAsAFunction = new Function("$dataitem", "$element", "return (" + value + ")");
                    return valueAsAFunction.call(null, dataitem, node);
                } catch (e) {
                    if (typeof options.onerror === "function") {
                        options.onerror("Evaluation Error: " + e.message);
                    }
                }
            }
            return;    // undefined
        },

        // this is the pattern which hold replaceable variables: {{ XXX }}
        pattern = function () {
        
            // we create a new one each time to get an empty regex
            var regexp = /\{\{.*\}\}/gmi;
            return regexp;
        },

        // Constructor
        TemplateManager = (function () {
            var collection = {};    // this is where we store the templates
            var Manager = function (options) {
                this.options = options;
            };
            Manager.prototype = {
                // add a new template object by name
                // NOTE: it will run over an old member who has the same name
                add: function (name, template) {
                    collection[name] = template;
                },
                    
                // retrieve template object by name
                get: function (name) {
                    if (collection.hasOwnProperty(name) &&
                            collection[name].nodeType === 1) {
                        // ELEMENT_NODE / DOCUMENT_POSITION_DISCONNECTED
                            
                        // return a recursive clone
                        return collection[name].cloneNode(true);
                    }
                    this.options.onerror("did not find template " + name);
                    return false;
                }
            };
            return Manager;
        }()),

        // implement another document object to hold the actual templates,
        // render them, and then throw the whole thing away
        renderAndStoreTamplates = function (string) {
            var doc = (function () {
                    if (typeof document.implementation.createHTMLDocument === "function") {
                        return document.implementation.
                                createHTMLDocument("TemplatesDocument").body;
                    } else {
                        return document.createElement("div");
                    }
                }()),
                collection = [],
                i = 0;
            doc.innerHTML = string;    // parse the HTML
            collection = this.options.selectorAll("*[" + constants.DOM_QUERY_ATTRIBUTE + "]", doc);
            i = collection.length;
            while (i--) {
            
                // keep the DOM Elements in a nicely named array in the templateManager
                this.templateManager.add(collection[i].getAttribute(constants.DOM_QUERY_ATTRIBUTE).trim(), collection[i]);
            }
            doc.innerHTML = "";    // empty the doc
            doc = null;    // destroy the doc
            return collection;
        },

        // load the HTML text from an external file
        loadTemplateFile = function (callback, urlString) {
            var that = this,
                XHR = new XMLHttpRequest();

            // false 'async' (default) waits here for the load event
            XHR.open("GET", urlString, this.options.async);
            XHR.setRequestHeader("Content-Type", "text/html");
            XHR.onreadystatechange = function () {
                // 200: ready, 0: localhost
                if (XHR.readyState === 4 && (XHR.status === 200 || XHR.status === 0)) {
                    callback.call(that, XHR.responseText);
                }
            };
            XHR.send();
            // no return value
        },

        // load template documents and strings
        initTemplates = function (args, searchOnPage) {
            searchOnPage = searchOnPage || false;
            var templatesStrings = [],
                collectedStrings,
                scriptCollections = searchOnPage === true ?
                        this.options.selectorAll("script[type=\"" + constants.SCRIPT_QUERY_NAME + "\"]", document) : [],
                addTemplatesString = function (string) {
                    templatesStrings.push(string);
                    collectedStrings--;
                    if (collectedStrings === 0) {
                        renderAndStoreTamplates.call(this, templatesStrings.join("\n"));

                        // notify that the templates are ready
                        setTimeout(this.options.onready, 0);
                    }
                },
                i;
            collectedStrings = scriptCollections.length + args.length;
            i = scriptCollections.length;

            // search for, and store, on-page script templates
            i = scriptCollections.length;
            while (i--) {
                addTemplatesString.call(this, retrieveString(scriptCollections[i]));
            }

            // loop through external template files
            i = args.length;
            while (i--) {
                if (typeof args[i] === "string") {

                    // item should be a URL string
                    loadTemplateFile.call(this, addTemplatesString, args[i]);
                }
            }
        },

        // Constructor
        Stencil = function () {
            
            // choose from options argument (optional last) or set defaults.
            // We set all the configurable options by the options object
            // unset options are set to their respective defaults
            this.options = (function (args) {
                var defaults = {
                
                        // default CSS selectors use native browser methods
                        selectorAll: function (query, context) {
                            context = context || win;
                            return context.querySelectorAll(query);
                        },
                        selector: function (query, context) {
                            context = context || win;
                            return context.querySelector(query);
                        },
                        
                        // report errors to a custom method
                        onerror: function () {
                            // default behaviour: do nothing
                        },
                        
                        // whether external templates file will load asynchronously
                        async: false,
                        
                        // notify templates ready to a custom method
                        onready: function () {
                            // default behaviour: do nothing
                        },
                        
                        // whether to allow evaluation on value strings
                        evaluate: false
                    },
                    optionsFromArguments,    // object
                    key;
                
                // if the last argument represents an options object
                if (args.length > 0 && typeof args[args.length - 1] === "object") {
                
                    // pop the arguments object by reference,
                    // the remaining arguments are file URLs or falsy arguments
                    // (false means search templates on the page)
                    optionsFromArguments = Array.prototype.pop.call(args);
                    for (key in optionsFromArguments) {
                    
                        // if the passed key exists and the type matches
                        if (defaults.hasOwnProperty(key) && typeof defaults[key] === typeof optionsFromArguments[key]) {
                            defaults[key] = optionsFromArguments[key];
                        }
                    }
                }
                return defaults;
            }(arguments));

            // manage the templates
            this.templateManager = new TemplateManager(this.options);

            // init load template documents and strings
            initTemplates.call(this, arguments, true);
        };
    Stencil.prototype = (function () {
        // retrieve a given element or the first match to the query
        var getElementOrQuery = function (element, context) {
                if (element === null) {
                    context.options.onerror("element is " + element);
                    return document.createDocumentFragment();    // keep the code running
                }
                if (typeof element === "string") {
                    return getElementOrQuery(context.options.selector(element, document), context);
                } else if (typeof element === "object" &&
                        (element.nodeType === 1 || element.nodeType === 11)) {
                    // ELEMENT_NODE / DOCUMENT_POSITION_DISCONNECTED || DOCUMENT_FRAGMENT_NODE
                    return element;
                }
                context.options.onerror("did not find element " + element);
                return document.createDocumentFragment();    // keep the code running
            },

            // create a new object by template name
            create = function (name, context) {
                var temporary = typeof name === "string" ? context.templateManager.get(name) : name;
                if (temporary === undefined) {
                    context.options.onerror(name + " was not found");
                    return document.createDocumentFragment();    // keep things running
                }
                temporary.removeAttribute("template-name");
                return temporary;
            },

            // Store Stencil extensions here
            // (replace handler attributes and plain attributes)
            extensions = {},

            // go through all node's attributes
            // first handle extension with their respective registered methods,
            // then handle regular attributes like strings
            replaceNodeAttributes = function (node, dataitem) {
                if (typeof node.attributes === "object" && node.attributes !== null) {
                    var i = node.attributes.length,
                        name = "",
                        value = "",
                        regularAttributes = [];
                    
                    // iterate through the extensions
                    while (i--) {
                        name = node.attributes[i].name;
                        if (node.getAttribute(name) !== null) {    // could have been removed
                            
                            // regex: ignore curly brackets
                            value = node.getAttribute(name).replace(/\{\{\s*|\s*\}\}/gmi, "");
                            
                            // if an extension was registered for the attribute name
                            if (typeof extensions[name] === "object" &&
                                typeof extensions[name].func === "function") {
                                
                                // execute the registered function
                                extensions[name].func.call(this, node, value, dataitem);
                                
                                // after handling the extension, remove the attribute
                                // unless specified differently
                                if (extensions[name].options.removeAttribute !== "false") {
                                    node.removeAttribute(name);
                                }
                            } else {
                            
                                // leave the regular attributes for later
                                regularAttributes.push(name);
                            }
                        }
                    }
                    
                    // reset the attributes loop
                    i = regularAttributes.length;
                    
                    // iterate through all remaining attributes,
                    // who have no dedicated extension method
                    while (i--) {
                        name = regularAttributes[i];
                        if (node.getAttribute(name) !== null) {    // could have been removed
                        
                            // replace strings by the regular pattern
                            value = findAndReplaceKeys.call(this, node.getAttribute(name), dataitem);
                            if (typeof node.setAttribute === "function") {
                                node.setAttribute(name, value);
                            } else {
                                // Patch alert!
                                setAttribute(node, name, value);
                            }
                        }
                    }
                }
                return node;
            },

            // replace the text value of an element
            // for simple text. regard only what's in curly brackets
            replaceNodeValue = function (node, dataitem) {
            
                // first see if the replacement is necessary
                if (pattern().test(node.nodeValue)) {
                    var text = findAndReplaceKeys.call(this, node.nodeValue, dataitem);
                    
                    // finally, remove remaining {{*}} strings not available in 'dataitem'
                    text = text.replace(pattern(), "");
                    if (node.parentNode !== null) {
                        node.parentNode.replaceChild(document.createTextNode(text), node);
                    }
                }
                return node;
            },

            // choose a method to replace node text, attributes, etc:
            nodeReplacements = function (node, dataitem) {
                var i = 0;
                
                // FORK: address different node types, well, differently
                switch (node.nodeType) {
                    case 1:    // ELEMENT_NODE / DOCUMENT_POSITION_DISCONNECTED

                        // changes the node's attributes
                        replaceNodeAttributes.call(this, node, dataitem);
                        i = node.childNodes.length;
                        while (i--) {
                            nodeReplacements.call(this, node.childNodes[i], dataitem);
                        }
                        break;
                    case 3:    // TEXT_NODE
                        replaceNodeValue.call(this, node, dataitem);
                        break;
                    case 11:    // DOCUMENT_FRAGMENT_NODE
                        i = node.childNodes.length;
                        while (i--) {    // iterate over the children
                            nodeReplacements.call(this, node.childNodes[i], dataitem);
                        }
                        break;
                    // no default
                }
                return node;
            };
        // privileged
        return {

            // helpers object - useful for writing extensions
            helpers: {
                getElementOrQuery: function (arg) {
                    return getElementOrQuery(arg, this);
                },
                getValue: function () {
                    return getValue.apply(this, arguments);
                }
            },

            // register custom attribute extensions to be handled with their respective functions
            extend: function (name, func, options) {
                if (typeof name !== "string" && typeof func !== "function") {
                    return false;
                }
                extensions[name] = {
                    func: func,
                    options: options || {}
                };
                return true;
            },

            // add templates to the collection from a string or an external file
            add: function (string, type) {
               if (typeof string !== "string") {
                    return false;
                }
                switch (type) {
                    case "file":
                        initTemplates.call(this, [string], false);
                        break;
                    case "text":
                        // fall through
                    default:
                        renderAndStoreTamplates.call(this, string);
                        break;
                }
                return true;
            },

            // apply Stencil behaviour on an existing DOM element
            process: function (element, dataitem, runcode) {
                dataitem = dataitem || {};
                element = getElementOrQuery(element, this);
                runcode = typeof runcode === "function" ? runcode : function (args) {
                    return args;
                };
                if (element.nodeType &&
                        (element.nodeType === 11 ||    // DOCUMENT_FRAGMENT_NODE
                         element.nodeType === 1)) {    // ELEMENT_NODE
                    return runcode(nodeReplacements.call(this, element, dataitem));
                }
                
                // if fails, return a fragment so to keep the engine going
                return document.createDocumentFragment();
            },

            // serve a given element node as a template
            serve: function (element, dataitem, runcode) {
                var copy = typeof element === "string" ? create(element, this) : element.cloneNode(true);
                return this.process(copy, dataitem, runcode);
            },

            // returns the filled template in a fragment
            get: function (name, dataitem, runcode) {
                return this.serve(name, dataitem, runcode);
            },
        
            // append the full template item into a parent element
            append: function (parent, name, dataitem, runcode) {
                parent = getElementOrQuery(parent, this);
                parent.appendChild(this.get(name, dataitem, runcode));
                return parent;
            },
        
            // insert as a first child
            insert: function (parent, name, dataitem, runcode) {
                parent = getElementOrQuery(parent, this);
                if (parent.childNodes.length > 0) {
                    parent.insertBefore(this.get(name, dataitem, runcode), parent.firstChild);
                    return parent;
                }
                
                // if the parent has no children, use append
                return this.append(parent, name, dataitem, runcode);
            },

            // empty the parent, then append the template item to it
            stipple: function (parent, name, dataitem, runcode) {
                parent = getElementOrQuery(parent, this);
                if (parent.innerHTML !== "") {
                    try {
                        parent.innerHTML = "";
                    } catch (error) {
                        
                        // fallback
                        while (parent.hasChildNodes()) {
                            parent.removeChild(parent.lastChild);
                        }
                    }
                }
                return this.append(parent, name, dataitem, runcode);
            }
        };
    }());

    win[namespace] = Stencil;
}(window, "Stencil"));