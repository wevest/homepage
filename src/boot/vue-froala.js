import FroalaEditor from "froala-editor";
import logger from 'src/error/Logger';

//import FroalaEditor from 'froala-editor';
export default (Vue, Options = {}) => {

  	var froalaEditorFunctionality = {

    	props: ['tag', 'value', 'config', 'onManualControllerReady'],

		watch: {
			value: function () {
				this.model = this.value;
				this.updateValue();
			}
		},

		render(createElement) {
			return createElement(
				this.currentTag,
				[this.$slots.default]
			)
		},

		created() {
			logger.log.debug("Froala.created");
			this.currentTag = this.tag || this.currentTag;
			this.model = this.value;
		},

		// After first time render.
		mounted() {
			logger.log.debug("Froala.mounted");

			if (this.SPECIAL_TAGS.indexOf(this.currentTag) != -1) {
				this.hasSpecialTag = true;
			}

			if (this.onManualControllerReady) {
				this.generateManualController();
			} else {
				this.createEditor();
			}
		},

		beforeDestroy() {
			this.destroyEditor();
		},

    	data() {

			return {

				initEvents: [],

				// Tag on which the editor is initialized.
				currentTag: 'div',

				// Editor element.
				_editor: null,

				// Current config.
				currentConfig: null,

				// Editor options config
				defaultConfig: {
					immediateVueModelUpdate: false,
					vueIgnoreAttrs: null
				},

				editorInitialized: false,

				SPECIAL_TAGS: ['img', 'button', 'input', 'a'],
				INNER_HTML_ATTR: 'innerHTML',
				hasSpecialTag: false,

				model: null,
				oldModel: null
			};
		},
		methods: {
			updateValue() {
				if (JSON.stringify(this.oldModel) == JSON.stringify(this.model)) {
					return;
				}
				
				logger.log.debug("Froala.updateValue");

				this.setContent();
			},

			createEditor() {

				if (this.editorInitialized) {
					return;
				}

				logger.log.debug("Froala.createEditor");

				this.currentConfig = this.clone(this.config || this.defaultConfig);
				this.currentConfig =  {...this.currentConfig};

				// Bind editor events.
				this.registerEvents();
				this.initListeners();

				this._editor = new FroalaEditor(this.$el, this.currentConfig)

				this.editorInitialized = true;

				this.setContent(true);
			},

			// Return clone object 
			clone(item) {
				const me = this;
				if (!item) {
					return item;
				} // null, undefined values check

				let types = [Number, String, Boolean], result;

				// normalizing primitives if someone did new String('aaa'), or new Number('444');
				types.forEach(function (type) {
					if (item instanceof type) {
						result = type(item);
					}
				});

				if (typeof result == "undefined") {
					if (Object.prototype.toString.call(item) === "[object Array]") {
						result = [];
						item.forEach(function (child, index, array) {
							result[index] = me.clone(child);
						});
					} else if (typeof item == "object") {
						// testing that this is DOM
						if (item.nodeType && typeof item.cloneNode == "function") {
							result = item.cloneNode(true);
						} else if (!item.prototype) { // check that this is a literal
							if (item instanceof Date) {
								result = new Date(item);
							} else {
								// it is an object literal
								result = {};
								for (var i in item) {
								result[i] = me.clone(item[i]);
								}
							}
						} else {
							if (false && item.constructor) {
								result = new item.constructor();
							} else {
								result = item;
							}
						}
					} else {
						result = item;
					}
				}
				return result;
			},

			setContent(firstTime) {

				if (!this.editorInitialized && !firstTime) {
					return;
				}

				if (this.model || this.model == '') {
					this.oldModel = this.model;

					if (this.hasSpecialTag) {
						this.setSpecialTagContent();
					} else {
						this.setNormalTagContent(firstTime);
					}
				}
			},

			setNormalTagContent(firstTime) {
				var self = this;

				//logger.log.debug("setNormalTagContent : _editor=",self._editor);

				function htmlSet() {
					//logger.log.debug("setNormalTagContent : value=",self._editor.html);
					if (! self._editor.html) {
						logger.log.error("Froala.setNormalTagContent : model=",self.model);						
						//return;
					}

					self._editor.html.set(self.model || '');

					//This will reset the undo stack everytime the model changes externally. Can we fix this?

					self._editor.undo.saveStep();
					self._editor.undo.reset();
				}

				if (firstTime) {
					this.registerEvent('initialized', function () {
						htmlSet();
					});
				} else {
					htmlSet();
				}

			},

			setSpecialTagContent() {

				var tags = this.model;

				// add tags on element
				if (tags) {

					for (var attr in tags) {
						if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
							this.$el.setAttribute(attr, tags[attr]);
						}
					}

					if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
						this.$el.innerHTML = tags[this.INNER_HTML_ATTR];
					}
				}
			},

			destroyEditor() {

				if (this._editor) {
					this._editor.destroy();
					this.editorInitialized = false;
					this._editor = null;
				}
			},

			getEditor() {
				return this._editor;
			},

			generateManualController() {
				var controls = {
					initialize: this.createEditor,
					destroy: this.destroyEditor,
					getEditor: this.getEditor,
				};

				this.onManualControllerReady(controls);
			},

			updateModel() {

				var modelContent = '';
				if (this.hasSpecialTag) {

				var attributeNodes = this.$el[0].attributes;
				var attrs = {};

				for (var i = 0; i < attributeNodes.length; i++ ) {
					var attrName = attributeNodes[i].name;
					if (this.currentConfig.vueIgnoreAttrs && this.currentConfig.vueIgnoreAttrs.indexOf(attrName) != -1) {
						continue;
					}
					attrs[attrName] = attributeNodes[i].value;
				}

				if (this.$el[0].innerHTML) {
					attrs[this.INNER_HTML_ATTR] = this.$el[0].innerHTML;
				}

				modelContent = attrs;
				} else {

					var returnedHtml = this._editor.html.get();
					if (typeof returnedHtml === 'string') {
						modelContent = returnedHtml;
					}
				}

				this.oldModel = modelContent;
				this.$emit('input', modelContent);
			},

			initListeners() {
				var self = this;
				this.registerEvent('initialized', function () {
					if (self._editor.events) {
						// bind contentChange and keyup event to froalaModel
						self._editor.events.on('contentChanged', function () {
							self.updateModel();
						});

						if (self.currentConfig.immediateVueModelUpdate) {
							self._editor.events.on('keyup', function () {
								self.updateModel();
							});
						}
					}
				})
			},

			// register event on editor element
			registerEvent(eventName, callback) {

				if (!eventName || !callback) {
					return;
				}

				// Initialized event.
				if (eventName == 'initialized') {
					this.initEvents.push(callback);
				}
				else {
					if (!this.currentConfig.events) {
						this.currentConfig.events = {};
					}

					this.currentConfig.events[eventName] = callback;
				}

			},

			registerEvents() {
				// Handle initialized on its own.
				this.registerInitialized();

				// Get current events.
				var events = this.currentConfig.events;

				if (!events) {
					return;
				}

				for (var event in events) {
					if (events.hasOwnProperty(event) && event != 'initialized') {
						this.registerEvent(event, events[event]);
					}
				}
			},

			registerInitialized() {
				// Bind initialized.
				if(!this.currentConfig.events) {
					this.currentConfig.events = {};
				}

				// Set original initialized event.
				if (this.currentConfig.events.initialized) {
					this.registerEvent('initialized', this.currentConfig.events.initialized);
				}

				// Bind initialized event.
				this.currentConfig.events.initialized = () => {
					for (var i = 0; i < this.initEvents.length; i++) {
						this.initEvents[i].call(this._editor);
					}
				}
			}
		}
  	};

  	Vue.component('Froala', froalaEditorFunctionality);

  	var froalaViewFunctionality = {

		props: ['tag', 'value'],

		watch: {
			value(newValue) {
				this._element.innerHTML = newValue;
			}
		},

		created() {
			this.currentTag = this.tag || this.currentTag;
		},

    	render(createElement) {
			return createElement(
				this.currentTag,{
					class: 'fr-view'
				}
			)
		},

		// After first time render.
		mounted() {
			this._element = this.$el;

			if (this.value) {
				this._element.innerHTML = this.value
			}
		},

		data() {
			return {
				currentTag: 'div',
				_element: null,
			};
		}
  	};

  	Vue.component('FroalaView', froalaViewFunctionality);
}

/*
export default (Vue, Options = {}) => {
	FroalaEditor.DefineIcon("alert", { NAME: "info", SVG_KEY: "help" });
	FroalaEditor.RegisterCommand("alert", {
		title: "Hello",
		focus: false,
		undo: false,
		refreshAfterCallback: false,
		callback() {
			alert("Hello!");
		}
	});
	var froalaEditorFunctionality = {
		props: ["tag", "value", "config", "onManualControllerReady"],

		watch: {
			value() {
				this.model = this.value;
				this.updateValue();
			}
		},

		render(createElement) {
			return createElement(this.currentTag, [this.$slots.default]);
		},

		created() {
			this.currentTag = this.tag || this.currentTag;
			this.model = this.value;
		},

		// After first time render.
		mounted() {
			if (this.SPECIAL_TAGS.indexOf(this.currentTag) != -1) {
				this.hasSpecialTag = true;
			}

			if (this.onManualControllerReady) {
				this.generateManualController();
			} else {
				this.createEditor();
			}
		},

		beforeDestroy() {
			this.destroyEditor();
		},

		data() {
			return {
				initEvents: [],

				// Tag on which the editor is initialized.
				currentTag: "div",

				// Editor element.
				_editor: null,

				// Current config.
				currentConfig: null,

				// Editor options config
				defaultConfig: {
				immediateVueModelUpdate: false,
				vueIgnoreAttrs: null
				},

				editorInitialized: false,

				SPECIAL_TAGS: ["img", "button", "input", "a"],
				INNER_HTML_ATTR: "innerHTML",
				hasSpecialTag: false,

				model: null,
				oldModel: null
			};
		},

		methods: {
			updateValue() {
				if (JSON.stringify(this.oldModel) == JSON.stringify(this.model)) {
				return;
				}

				this.setContent();
			},

		createEditor() {
			if (this.editorInitialized) {
				return;
			}

			this.currentConfig = this.config || this.defaultConfig;

			this.setContent(true);

			// Bind editor events.
			this.registerEvents();
			this.initListeners();

			this._editor = new FroalaEditor(this.$el, this.currentConfig);

			this.editorInitialized = true;
		},

		setContent(firstTime) {
			if (!this.editorInitialized && !firstTime) {
				return;
			}

			if (this.model || this.model == "") {
				this.oldModel = this.model;

				if (this.hasSpecialTag) {
					this.setSpecialTagContent();
				} else {
					this.setNormalTagContent(firstTime);
				}
			}
		},

		setNormalTagContent: function(firstTime) {
			var self = this;

			function htmlSet() {
				logger.log.debug("Froala.setNormalTagContent : editor=",self._editor.html);

				self._editor.html.set(self.model || "");

				//This will reset the undo stack everytime the model changes externally. Can we fix this?

				self._editor.undo.saveStep();
				self._editor.undo.reset();
			}

			if (firstTime) {
				this.registerEvent("initialized", function() {
					htmlSet();
				});
			} else {
				htmlSet();
			}
		},

		setSpecialTagContent() {
			var tags = this.model;

			// add tags on element
			if (tags) {
				for (var attr in tags) {
					if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
					this.$el.setAttribute(attr, tags[attr]);
					}
				}

				if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
					this.$el.innerHTML = tags[this.INNER_HTML_ATTR];
				}
			}
		},

		destroyEditor() {
			if (this._editor) {
				this._editor.destroy();
				this.editorInitialized = false;
				this._editor = null;
			}
		},

		getEditor() {
			return this._editor;
		},

		generateManualController() {
			var controls = {
			initialize: this.createEditor,
			destroy: this.destroyEditor,
			getEditor: this.getEditor
			};

			this.onManualControllerReady(controls);
		},

		updateModel() {
			var modelContent = "";

			if (this.hasSpecialTag) {
			var attributeNodes = this.$el[0].attributes;
			var attrs = {};

			for (var i = 0; i < attributeNodes.length; i++) {
				var attrName = attributeNodes[i].name;
				if (
				this.currentConfig.vueIgnoreAttrs &&
				this.currentConfig.vueIgnoreAttrs.indexOf(attrName) != -1
				) {
				continue;
				}
				attrs[attrName] = attributeNodes[i].value;
			}

			if (this.$el[0].innerHTML) {
				attrs[this.INNER_HTML_ATTR] = this.$el[0].innerHTML;
			}

			modelContent = attrs;
			} else {
			var returnedHtml = this._editor.html.get();
			if (typeof returnedHtml === "string") {
				modelContent = returnedHtml;
			}
			}

			this.oldModel = modelContent;
			this.$emit("input", modelContent);
		},

		initListeners: function() {
			var self = this;

			this.registerEvent("initialized", function() {
			if (self._editor.events) {
				// bind contentChange and keyup event to froalaModel
				self._editor.events.on("contentChanged", function() {
				self.updateModel();
				});

				if (self.currentConfig.immediateVueModelUpdate) {
				self._editor.events.on("keyup", function() {
					self.updateModel();
				});
				}
			}
			});
		},

		// register event on editor element
		registerEvent: function(eventName, callback) {
			if (!eventName || !callback) {
			return;
			}

			// Initialized event.
			if (eventName == "initialized") {
			this.initEvents.push(callback);
			} else {
			if (!this.currentConfig.events) {
				this.currentConfig.events = {};
			}

			this.currentConfig.events[eventName] = callback;
			}
		},

			registerEvents: function() {
				// Handle initialized on its own.
				this.registerInitialized();

				// Get current events.
				var events = this.currentConfig.events;

				if (!events) {
				return;
				}

				for (var event in events) {
					if (events.hasOwnProperty(event) && event != "initialized") {
						this.registerEvent(event, events[event]);
					}
				}
			},

			registerInitialized() {
				// Bind initialized.
				if (!this.currentConfig.events) {
					this.currentConfig.events = {};
				}

				// Set original initialized event.
				if (this.currentConfig.events.initialized) {
					this.registerEvent(
						"initialized",
						this.currentConfig.events.initialized
					);
				}

				// Bind initialized event.
				this.currentConfig.events.initialized = () => {
					for (var i = 0; i < this.initEvents.length; i++) {
						this.initEvents[i].call(this._editor);
					}
				};
			}
		}
	};

	Vue.component("Froala", froalaEditorFunctionality);

	var froalaViewFunctionality = {
		props: ["tag", "value"],

		watch: {
			value(newValue) {
				this._element.innerHTML = newValue;
			}
		},

		created() {
			this.currentTag = this.tag || this.currentTag;
		},

		render(createElement) {
			return createElement(this.currentTag, {
				class: "fr-view"
			});
		},

		// After first time render.
		mounted() {
			this._element = this.$el;

			if (this.value) {
				this._element.innerHTML = this.value;
			}
		},

		data() {
			return {
				currentTag: "div",
				_element: null
			};
		}
	};

	Vue.component("FroalaView", froalaViewFunctionality);
};
*/