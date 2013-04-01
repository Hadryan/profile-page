// Collection Contestants.js
// -------------------------
define(["jquery", "backbone", "models/Contestant"],

	function($, Backbone, Contestant) {
		
		var Contestants = Backbone.Collection.extend({
			
			model: Contestant,
			
			urlRoot: APC.plugin_url + '/api/profile/contestants',
			
			url: function(){
				var base = this.urlRoot;
      				options = this.options;
      			return ( options.action ) ? base + '/' + options.action + '/' + options.value : base
			},
			
			initialize: function( options ){
				
      			this.options = options || {}
				
				this.on('all', function( event ){
					console.log('%c[COLLECTION Contestants]', 'background:#222; color:#bada55', "url :", this.url(), "event :", event)
				})
				
			}
		})
		
		return Contestants
	}

)
