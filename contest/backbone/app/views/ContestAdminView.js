// ContestAdminView.js
// -------------------
define(["jquery", "backbone", "utils", "collections/Collection", "text!templates/ContestAdmin.html"],
	
	
	function($, Backbone, utils, Collection, template) {
		
		var ContestAdminView = Backbone.View.extend({
			
			el: '#contest-wrapper',
			
			template: _.template(template),
			
			initialize: function( options ){
				
				this.data = options
				
				this.data.contests.selected = ''
    			console.log(this.data)
    			
    			this.contests = options.contests
    			
			},
			
			render: function(){
    			console.log(this.data)
				var self = this				
				$(this.el).html( this.template(self.data) )
				return this.el
			},
			
			events: {
				"click .delete" : "deleteParticipant",
				"change #filter-by-month" : "filterByMonth",
				"change #filter-by-year" : "filterByYear"
			},
			
			filterByMonth: function(e){
				var value = e.currentTarget.value

				var contests = (_.isEmpty(value)) ? this.contests : this.contests.filterByMonth(value);
				contests.selected = value
				this.data.contests = contests
				this.render()
			},
			
			filterByYear: function(e){
				var value = e.currentTarget.value
				
				var contests = (_.isEmpty(value)) ? this.contests : this.contests.filterByYear(value);
				contests.selected = value
				this.data.contests = contests
				this.render()
			},
			
			deleteParticipant: function(e){
				var button = $(e.currentTarget),
					cID    = button.data('id'),
					parent = button.parents('.download-table-body')
					
				parent.addClass('load')
				
				var contestant = this.contestants.at(cID)
				console.log(contestant)
				
				contestant.destroy({
					success: function(data){
						parent.fadeOut('slow',function(){ 
							$(this).remove() 
							Utils.showMessage('success', 'Contestant deleted succesfully')
						})
					},
					error: function(){
						Utils.showMessage('erorr', 'Error occured. Please try again !!')
					}
				})
					
				return false
			}
			
		})
		
		return ContestAdminView
		
	}
	
)
