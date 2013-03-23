// ContestView.js
// --------------
define(["jquery", "backbone", "mediaelement", "utils", "models/Model",
		// templates
		"text!templates/ContestEmpty.html", 
		"text!templates/ContestView.html", 
		"text!templates/ContestViewQuiz.html", 
		"text!templates/ContestViewPurchase.html"],

	function($, Backbone, mediaelementplayer, utils, Model, ContestEmpty, ContestTemplate, ContestQuiz, ContestPurchase){
		
		var ContestView = Backbone.View.extend({
			
			el: '#contest-wrapper',
			
			template: _.template(ContestTemplate),
			
			initialize: function(){
				console.log( this.model.toJSON() )
			},
			
			render: function(){
				
				// show empty contest, if this new
				if( this.model.isNew() ){
					$(this.el).html( _.template(ContestEmpty) )
					return this.el
				}
				
				// define variables
				var contest     = this.model.toJSON(),
					contestMeta = this.model.get('meta'),
					contestContent = contestMeta.content;
					
				var dateCountdown = contest.end;
				// is not started yet ?
				if( !contest.started )
				{
					dateCountdown = contest.start;
					// create nice start date
					var startDateObj = Utils.parseDate(dateCountdown, 'mm/dd/yyyy')
					contest['start_date'] = $.datepicker.formatDate(
						'M, d yy', 
						new Date(parseInt(startDateObj[0]), parseInt(startDateObj[1]), startDateObj[2]));
				}
				
				console.log(dateCountdown)
				
				// contest view template
				$(this.el).html( _.template(ContestTemplate, contest) )
				
				// set the countdown for the first time
				// set comment below, if you want using the spin while waiting to do a countdown
				Utils.setCountdown(dateCountdown)
				
				// contest content template
				var contestTpl = ( contestMeta.type == 'quiz' ) ? ContestQuiz : ContestPurchase ;
				contestContent['baseUrl'] = contest.baseUrl
				contestContent['started'] = contest.started
				this.$('#contest-content').html( _.template( contestTpl, contestContent ) )
				
				// do countdown
				Utils.doCountDown( dateCountdown, this.$('#contest-countdown') )
				// youtube video media element player
				if( this.$('video').length ) {
					$('video').mediaelementplayer()
				}
				
				return this.el
			},
			
			events: {
				// contest quiz
				"change #quiz-box input[name='choice']" : "doAnswer",
				// contest purchase text
				"blur input[type=text]"					: "getUserValue",
				// contest purchase upload image
        		"click #image-upload .select-image" 	: "uploadImage",
        		"click .uploaded-image img"				: "uploadImage",
        		// do step 3
				"click .contest-bottom-right a" 		: "doNextStep"
			},
			
			doAnswer: function(e){
				var value = e.currentTarget.value
				
				var meta    = this.model.get('meta'),
					correct = meta.content.answer,
					message;
				
				if( _.isUndefined(correct) ) throw new Error('Unknown contest content')
				
				var re = new RegExp(correct, 'i')
				if( value.match(re) ){
					$(e.currentTarget).replaceWith('<div class="right-choice"></div> ')
					message = 'Your Answer is correct!'
				} 
				else {
					// display correct answer
					$(':radio[value="'+ correct.toLowerCase() +'"]')
						.replaceWith('<div class="right-choice"></div> ')
						
					message = ( meta.content.force.type ) ? meta.content.force.value : ''
				}
				// set answer message
				$('#contest-message').html( message )
				
				// set disable all input choices
				$('input[name="choice"]')
					.map(function(i,e){
						$(e).attr('disabled', 'disabled')
					})
					
				// remove attribute disabled on 'next' button
				$('.contest-bottom-right a')
					.removeAttr('disabled')
					
				// set gobal user value for "step 2"
				window.user_value = value
			},
			
			getUserValue: function(e){
				var value = e.currentTarget.value
				console.log(value)
				window.user_value = value
			},
			
			uploadImage: function(e){
				var self 	  = this,
					target	  = e.currentTarget,
					parentEl  = $(target).parents('#image-upload'),
        		  	inputFile = $('input[type="file"]', parentEl),
        		  	readEl    = inputFile.siblings('.uploaded-image');
        		  	
        		inputFile.bind('change', { model:this.model, parent:parentEl[0], readEl:readEl[0] }, this.fileReaderUpload).click()
			},
			
			/* upload the file image after selected, then read that image */
        	fileReaderUpload: function(e){
        		var target  = e.currentTarget,
        			parent  = e.data.parent,
        			model   = e.data.model,
        			readEl  = e.data.readEl;
        			
        		console.log('fileReaderUpload', e)
        		
        		var file = e.target.files[0];
        		
        		// File Reader
        		var reader = new FileReader
        		reader.onerror = this.errorHandler
        		// create loading spin
        		reader.onloadstart = function(evt){
        			$(parent).switchClass('showed','load',0)
        		}
        		// set image selected
        		reader.onloadend = (function(file){
        			return function(evt){
        				
        				console.log('File', file, 'Target', target, 'evt', evt)
        				
        				Utils.upload(file, target.id, model, function(response){
        					
	        				console.log('response after uploaded', response)
	        				
        					// create element img 
		        			var img = $('<img/>')
		        			// set img atrributes
		        			img[0].src = evt.target.result;
		        			img[0].title = 'Click to change';
		        			
		        			// show image in 1 sec
		        			setTimeout(function(){
		        				$(parent).switchClass('load', 'showed', 0)
		        				
		        				// remove img its exists
		        				if( $('img', readEl).length ){
		        					$('img', readEl).remove()
		        				}
		        				
		        				// append child
								$(readEl).append(img)
		        					
		        				console.log('element', readEl)
	        				
		        				// set gobal user value for "step 2"
								window.user_value = response.url
		        				console.log('user value', window.user_value)
						
								// remove attribute disabled on 'next' button
								$('.contest-bottom-right a')
									.removeAttr('disabled')
		        				
		        			},1000)
        				})
        			}
        		})(file, target)
        		// read as Data URI
        		reader.readAsDataURL(file)
        	},
			
			doNextStep: function(e){
				if( $(e.currentTarget).attr('disabled') ) {
					e.preventDefault()
				}
			}
		})
		
		return ContestView
		
	}

)
