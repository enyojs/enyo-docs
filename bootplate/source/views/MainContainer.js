(function (enyo, scope) {
	
	enyo.kind({
		name: 'api.MainContainer',
		kind: 'api.StaticControl',
		id: 'main-container',
		tap: function (sender, event) {
			if (event.target.tagName == 'A') {
				if (event.target.getAttribute('href') == 'javascript:void(0);') {
			
					var target = event.target,
						classes = target.getAttribute('class'),
						content = target.innerHTML,
						list,
						node,
						elem,
						i;
			
					if (classes.indexOf('property') > -1) {
						list = this.node.querySelectorAll('div.section > div.property');
					} else if (classes.indexOf('method') > -1) {
						list = this.node.querySelectorAll('div.section > div.method');
					}
			
					if (list.length) {
						for (i = 0; i < list.length; ++i) {
							node = list.item(i);
							if (node) {
								elem = node.querySelector('span.name');
								if (elem.innerHTML == content) {
									node.scrollIntoView();
									break;
								}
							}
						}
					}
				}
			}
			
			return true;
		}
	});
	
})(enyo, this);