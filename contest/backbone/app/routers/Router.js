// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "utils",
		// models
		"models/Model", 
		"models/Contestant",
		// collections
		"collections/Collection",
		"collections/Contestants",
		// templates
		"views/ContestSetupView", 
		"views/ContestView", 
		"views/ContestSubscribeView", 
		"views/ContestThanksView",
		"views/ContestAdminView"],
        
    function($, Backbone, utils, 
    		Model, ContestantsModel, 
    		Collection, Contestants, 
    		ContestSetupView, ContestView, ContestSubscribeView, ContestThanksView, ContestAdminView ) {

        var Router = Backbone.Router.extend({

            initialize: function() {

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();

            },

            // All of your Backbone Routes (add more)
            routes: {
                
                // When there is no hash on the url, the home method is called
                "contest"			: "contestRecent",
                
                "contest/setup"     : "contestSetup",
                
                "contest/edit/:id"  : "contestEdit",
                
                "contest/delete/:id": "contestDelete",
                
                "contest/step/:step": "contestStep",
                
                "contest/admin"		: "contestAdmin"

            },
            
            getRecent: function( callback ){
            	var self = this
            	
            	if( this.model ){
            		console.log('Recent contest is loaded', this.model)
            		if( callback ) callback.call(this)
            	}
            	else {
            		console.info('Recent contest Fetching..')
            		var model = new Model({ action:'recent' })
	            	model.fetch({
	            		success: function( model ){
	            			this.model = model 
	            			console.log('isNew', this.model.isNew(), 'model', model)
	            			if( callback ) callback.call(this)
	            		}
	            	})
            	}
            },
            
            contestRecent: function(){
            	var self = this
            	
            	this.getRecent(function(){
        			console.log('contestLastest', this.model)
            		new ContestView({ model:this.model }).render()
            	})
            	
            },
            
            contestSetup: function() {
            	var self = this
            	
            	this.getRecent(function(){
            		if( this.model.isNew() )
						new ContestSetupView({ model:new Model }).render()
					else
						self.navigate("#/contest")
            	})
            	
            },
            
            contestView: function( id ){
            	
            	var model = new Model({ ID:id })			
				model.fetch({
					success: function( data ){	
						new ContestView({ model:data }).render()
					}
				})
            },
            
            contestEdit: function( id ){
            	
				var model = new Model({ ID:id })			
				model.fetch({
					success: function( data ){	
						new ContestSetupView({ model:data }).render()
					}
				})
            },
            
            contestDelete: function( id ){
            	var model = new Model({ ID:id })
            	model.destroy({
					success:function( resp ){
						console.info('Contest deleted successfully')
						console.log( resp )
						window.history.back()
					},
					error: function( err ){
						console.error('Error occured')
						console.log( err )
					}
				})
            },
            
            contestStep: function( step ){
            	
            	this.getRecent(function(){
            		if( this.model.isNew() )
            			self.navigate("#/contest")
					else {
						console.log( step )
						if( step == 2 )
							new ContestSubscribeView({ model:this.model  }).render()
		            	else if( step == 3 )
		            		new ContestThanksView({ model:this.model }).render()
					}
						
            	})
            	
            },
            
            contestAdmin: function(){
            	
            	var contests = new Collection()
            	contests.fetch({
            		success: function(){
            			var recent = contests.getRecent()
        				console.log('recent', recent)
        				if( _.isNull(recent) ) {
        					new ContestAdminView({ contests:contests, recent:null, contestants:null }).render()
        					return
        				} 
        				
            			var contestants = new Contestants({ action:'all', value:recent.id })
	            		contestants.fetch({
	            			success: function( data ){
	            				new ContestAdminView({ contests:contests, recent:recent, contestants:contestants }).render()
	            			}
	            		})
            		}
            	})

            }
            
        });
        
        // Returns the Router class
        return Router;

    }

);