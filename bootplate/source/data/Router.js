(function (enyo, scope) {
	
	function normalize (path) {
		return path.replace(/\/+/g, '/');
	}
	
	function findFile (path, fn) {
		var xhr = new enyo.Ajax({
			handleAs: 'text',
			contentType: 'text/html',
			url: path
		});
		
		xhr.response(fn);
		xhr.go();
	}
	
	enyo.kind({
		name: 'api.Router',
		kind: 'enyo.Router',
		triggerOnStart: true,
		routes: [
			{default: true, path: '/browse', handler: 'routePage'},
			{path: '/browse/:nom', handler: 'routeNamespace'},
			{path: '/kind/:nom', handler: 'routeKind'},
			{path: '/ui/:nom', handler: 'routeKind'},
			{path: '/namespace/:nom', handler: 'routeNamespace'},
			{path: '/utility/:nom', handler: 'routeUtility'}
		],
		
		updateContainer: function (res, data) {
			var node = enyo.dom.byId('main-container');
			if (node) enyo.dom.setInnerHtml(node, data);
		},
		
		routePage: function (pagenom) {
			
			if (!pagenom) return this.trigger({change: true, location: this.get('defaultPath')});
			
			var path = normalize('assets/pages/' + pagenom + '.html');
			
			findFile(path, this.updateContainer);
		},
		
		routeKind: function (nom) {
			var path = normalize('assets/kind/' + nom + '.html');
			
			findFile(path, this.updateContainer);
		},
		
		routeUtility: function (namespace, nom) {
			
		},
		
		routeNamespace: function (nom) {
			var path = normalize('assets/namespace/' + nom + '.html');
			
			findFile(path, this.updateContainer);
		}
	});
	
})(enyo, this);