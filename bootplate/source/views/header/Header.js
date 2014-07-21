(function (enyo, scope) {
	
	enyo.kind({
		name: 'api.Header',
		kind: 'api.StaticControl',
		components: [
			{name: 'search', kind: 'api.SearchBox'}
		]
	});
	
})(enyo, this);