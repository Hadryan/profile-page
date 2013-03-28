// ContestSubscribeView.js
// -----------------------
define(["jquery", "backbone", "utils", "models/Contestant", "collections/Contestants", "text!templates/ContestSubscribe.html"],

	function($, Backbone, utils, Contestant, Contestants, template){
		
		var ContestSubscribeView = Backbone.View.extend({
			
			el: '#contest-wrapper',
			
			template: _.template( template ),
			
			initialize: function(){
				
				console.log(this.model)
				
				this.contestant = new Contestant
				console.log('ContestSubscribeView', this.model.toJSON(), this.contestant )
				
				
				this.listenTo(this.model, 'destroy', this.remove);
				
			},
			
			render: function(){
				
				// get object ID and meta only
				// it's like a array_intersect on PHP
				var data = _.pick(this.model.toJSON(), 'ID', 'meta')
				
				$(this.el).html( this.template(data) )
				
				return this.el
			},
			
			events: {
				"change .select-field-toggle" 	: "toggleInput",
				"submit #contest-step-2" 		: "doNextStep"
			},
			
			/* show input textfield by combobox (YES/NO) */
			toggleInput: function(e){
				var target = e.currentTarget
				$(target).next()
					.val('')
					.fadeToggle('slow', function(){
						if( $(this).is(':visible') && target.value == 1 ){
							$(this).prop('required',true)
						} else {
							$(this).prop('required',false)
						}
					})
			},
			
			doNextStep: function(e){
				var self = this
				var data = $(e.currentTarget).toJSON()
				
				console.log(data)
				
				this.contestant.save(data, {
					wait : true,
					success: function( resp ){
						console.info('Success')
						console.log( resp )
						// navigate to step 3
						self.remove()
						app.navigate('#/contest/step/3')
					},
					error: function( err ){
						console.error('Error')
						console.log( err )
					}
				})
				
				return false
			},
			
			remove: function() {
			    this.$el.empty();
			    this.undelegateEvents();
			    return this;
			}
		})
		
		return ContestSubscribeView
		
	}

)
