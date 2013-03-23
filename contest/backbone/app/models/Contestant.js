// Model Contestant.js
// -------------------
define(["jquery", "backbone"],

	function($, Backbone){
		
		var Contestant = Backbone.Model.extend({
			
			idAttribute: 'ID',
			
			urlRoot: window.baseUrl + '/profile-page/api/profile/contestants',
        	
        	url: function(){
        		
        		var base = window.baseUrl + '/profile-page/api/profile/contestants';
        		
        		// POST : save contest	=> http://{SERVER_HOST}/api/profile/contestants
        		if(this.isNew()) return base
        		
        		// GET/PUT/DELETE => http://{SERVER_HOST}/api/profile/contestants/{:id}
        		return base + '/' + encodeURIComponent(this.id)
        	},
			
			initialize: function(){
				
				this.on('all', function( event ){
					console.log('%c[MODEL Contestant]', 'background:#222; color:#bada55', "url :", this.url(), "event :", event)
				})
				
			}
			
		})
		
		return Contestant
		
	}

)
