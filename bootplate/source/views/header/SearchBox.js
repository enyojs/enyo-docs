enyo.kind({
	name: 'api.SearchBox',
	id: 'search',
	kind: 'api.StaticControl',
	classes: 'search',
	canGenerate: true,
	defaultKind: 'enyo.Control',
	components: [
		{name: 'input', kind: 'enyo.Input', placeholder: 'Search'}
	]
});