(function (enyo, scope) {
	
	enyo.kind({
		name: 'api.Sidebar',
		kind: 'api.StaticControl',
		classes: 'sidebar container',
		components: [
			{tag: 'h2', content: 'Namespaces'},
			{tag: 'h2', content: 'Kinds'}
		]
	});
	
})(enyo, this);