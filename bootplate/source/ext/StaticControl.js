(function (enyo, scope) {
	
	var Control = enyo.Control,
		StaticControl;

	/**
	* A special kind of control designed to work with static HTML markup. It relies on a defined
	* `id` attribute that it uses to attach itself to previously generated DOM nodes and is
	* customized to handle particular types of events and manipulate its children through explicit
	* relative DOM queries. They do still have the ability to have children that can, alternatively,
	* inject their own content into the DOM (and optionally manage it as a normal
	* {@link enyo.Control}).
	*
	* @class api.StaticControl
	* @extends enyo.Control
	* @public
	*/
	StaticControl = enyo.kind(
		/** @lends api.StaticControl.prototype */ {
		
		/**
		* @private
		*/
		name: 'api.StaticControl',
		
		/**
		* @private
		*/
		kind: Control,
		
		/**
		* @private
		*/
		noDefer: true,
		
		/**
		* This is now set to `false` by default and only set to `true` deliberately.
		*/
		canGenerate: false,
		
		/**
		*
		*/
		generated: false,
		
		/**
		* @private
		*/
		defaultKind: 'api.StaticControl',
		
		renderInto: function () {
			this.render();
		},
	
		render: function () {
			var delegate = this.renderDelegate || enyo.Control.renderDelegate;

			this.findNodeById();
			
			if (this.canGenerate) {
				if (this.node) this.generated = true;
				
				if (this.hasNode()) {
					delegate.renderDom(this);
					if (this.generated) this.rendered();
				}
			}
			
			if (this.children.length) {
				this.children.forEach(function (ln) {
					ln.render();
				});
			}
		}
	});

	/**
	* Before all other controls are initialized we remap this so they will inherit from this kind
	* if somehow we missed the actual declaration in the kind definition.
	*
	* @name enyo.defaultCtor
	* @type {Function}
	* @default {api.StaticControl}
	*/
	// enyo.defaultCtor = StaticControl;
	
})(enyo, this);