(function (enyo, scope) {
	
	/**
	* The core view managed by the enyo application portion of the site.
	*
	* @class api.Index
	* @extends api.StaticControl
	* @public
	*/
	enyo.kind({
		name: 'api.Index',
		kind: 'api.StaticControl',
		tag: null,
		defaultProps: {publish: true},	
		
		// it is important to remember that with these types of controls they do not necessarily
		// mirror the exact DOM structure or hierarchy - they attach themselves to a particular node
		// and manage its lifecycle and events but has little awareness of the actual DOM
		components: [
			{id: 'header', name: 'header', kind: 'api.Header'},
			{id: 'sidebar', name: 'sidebar', kind: 'api.Sidebar'},
			{id: 'main-container', name: 'main', kind: 'api.MainContainer'},
			{id: 'footer', name: 'footer', kind: 'api.Footer'}
		]
	});
	
})(enyo, this);