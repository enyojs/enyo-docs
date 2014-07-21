enyo.kind({
	name: 'api.Application',
	kind: 'enyo.Application',
	view: 'api.Index',
	noDefer: true,
	components: [
		{name: 'router', kind: 'api.Router', publish: true}
	]
});

enyo.ready(function () {
	
	var app = new api.Application({name: 'app'});
	
});