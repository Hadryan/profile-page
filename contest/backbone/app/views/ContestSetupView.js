// View.js
// -------
define(["jquery", "jquerylimiter", "utils", "bootstrap", "backbone", "models/Model", "collections/Collection", "text!templates/ContestSetup.html", "text!templates/ContestQuiz.html", "text!templates/ContestPurchase.html"],

    function($, limiter, utils, bootstrap, Backbone, Model, Collection, 
				ContestSetupTemplate, 
				ContestQuizeTemplate, 
				ContestPurchaseTemplate ){

		var filesSelected = [],
			   filesSize  = 0,
//			   filesCount = 0,
			   progress   = 0;
			   
		var uploadCompleted = false;
		
        var ContestSetupView = Backbone.View.extend({
        	
        	el: '#contest-wrapper',
        	
        	// template
        	template: _.template( ContestSetupTemplate ),
        	
        	// button date picker jquery ui
        	btnDatePicker: APC.plugin_url  + "/contest/images/date-button.gif",
        	
        	// progress bar element
        	progressBar: '.spinner',
				    
			// text limiter
			textLimiter: {
				text : 100,
				desc : 400
			},
        	
        	initialize: function(){
				
				console.log('Model', this.model.toJSON() )		
				
				this.url = this.model.url()	
				
        	},
        	
        	render: function(){
        		
        		var self = this 
        		
        		var model = this.model.toJSON()
        		
        		$(this.el).html( this.template( model ) )
        		
        		this.rowsPrice = this.$('.input-price').length	
        		
				this.$('.datepicker, input, textarea')
					.map(function(i,e){
						// date picker
						if( $(e).hasClass('datepicker') ){
							// datepicker options
							var options = {
								minDate: 0, 
						      	showOn: "button",
						      	buttonImage: self.btnDatePicker,
						      	buttonImageOnly: true
						    }
						    // set max start date for 1 week
						    if( e.name == 'start' ) options['maxDate'] = "+1W"
							// datepicker
							$(e).datepicker(options)
						}
						// text limiter
						else if( $(e).next().hasClass('counter-limiter') ) {
							var textLimiter = ( this.type == 'text' ) ? self.textLimiter.text : self.textLimiter.desc
							var counter = $(e).next().find('strong')
							$(e).limiter(textLimiter, counter)
						}
					})
					
				var contestType = model.meta.type ;
				if( !_.isEmpty(contestType) ){
					$('#contest-type').val(contestType).trigger('change')
				}
				

        		return this.el
        	},
        	
        	// event listeners
        	events: {
				// select combobox
				"change #contest-type" 					: "showContestField",
				"change .select-field-toggle" 			: "toggleInput",
				"change input:radio.radio-quiz" 		: "changeQuizField",
				"change #choice-answer"					: "changeAnswer",
				"change #select-identifier"				: "changeIndentifier",
				"change #toggle-tc"						: "changeTerms",
				// input text price field
        		"keydown .input-price" 					: "addPriceByKey",
				// button
        		"click .setup-add a"   					: "addPrice",
        		"click .quiz_selection label"			: "changeQuizByLabel",
        		"click .setup-row .select-image"  		: "selectImage",
        		"click .uploaded-image img"  			: "selectImage",
    			"click .quiz_image .select-image" 		: "selectQuizImage",
        		"click .remove-upload-image" 			: "removePrice",
        		"submit #contestForm"  					: "beforeSave"
        		//"click .tc-update"   : "saveContest"
        	},
			
			/* show contest field by type */
			showContestField: function(e){
				var self = this;
				
				var target = e.currentTarget,
					parent = $(target).parents('.setup-row'),
					oldContest = parent.next(),
					template;
					
				var model = this.model.toJSON()	
				var content = model.meta.content
				
				console.log( content )
				
				// remove old contest type field
				if( oldContest.hasClass('setup-row-contest') )
					oldContest.remove()
				
				// create template by type
				if( target.value == 'quiz' )
				{
					var dataContent = {
						purchase: { type:'text', name:'' },
						quiz: ( model.meta.type == 'purchase' ) ? this.model.defaults.meta.content : content
					}
					
					console.log(dataContent)
					
					template = _.template( ContestQuizeTemplate, dataContent )
				
					// insert after parent, then slide down
					$(template)
						.insertAfter(parent)
					    .slideDown('slow', function(){
					    	// text limiter
					    	$('input, textarea', this)
								.map(function(i,e){
									if( $(e).next().hasClass('counter-limiter') ) {
										var textLimiter = ( this.type == 'text' ) ? self.textLimiter.text : 200
										var counter = $(e).next().find('strong')
										$(e).limiter(textLimiter, counter)
									}
								})
					    })
										
				} 
				else if( target.value == 'purchase')
				{
					var dataContent = {
						purchase: (this.model.isNew()) ? { type:'text', name:'' } : content,
						quiz: this.model.defaults.meta.content
					}
					
					template = _.template( ContestPurchaseTemplate, dataContent )
					// insert after parent, then slide down
					$(template)
						.insertAfter(parent)
					    .slideDown('slow')
				}	
			},
			
			/* show input textfield by combobox (YES/NO) */
			toggleInput: function(e){
				var target = e.currentTarget
				$(target).next().fadeToggle('slow', function(){
					if( $(this).is(':visible') ){
						$(this).prop('required',true)
						if( $(this).next().hasClass('counter-limiter') ) $(this).next().show()
					} else {
						$(this).prop('required',false)
						if( $(this).next().hasClass('counter-limiter') ) $(this).next().hide()
					}
				})
			},
			
			/* change quiz field type (video/pic) */
			changeQuizField: function(e){
				console.log(e.currentTarget.value)
				if( e.currentTarget.value == 'video' ){
					$('#select_quiz_type').switchClass('pic','video',0)
				} else {
					$('#select_quiz_type').switchClass('video','pic',0)
				}
				console.log($('#select_quiz_type')[0])
			},
			
			changeQuizByLabel: function(e){
				var attr = $(e.currentTarget).attr('for')
				console.log(attr)
				$('input[type="radio"]', $('.'+attr)).click()
			},
        	
        	/* 
        	 * change answer field 
        	 * make sure the choice field by selected answer field has value 
        	 */
        	changeAnswer: function(e){
        		var choice = e.currentTarget.value
        		
        		var label = $('.control-group.choices label').filter(function(){
        			return $(this).html().toLowerCase() == choice
        		})
        		
        		console.log(label[0])
        		
        		var value = label.next().val()
        		if( _.isEmpty(value) ){
        			label.next().focus()
        			alert('Please enter a value for choice ' + label.html() )
        		}
        	},
        	
        	changeIndentifier: function(e){
        		var value = e.currentTarget.value,
        			input = this.$('#input-identifier')
        			
        		if( value == 'text' )
        			input.attr('placeholder','E.g Receipt Number / Code')
        		else
        			input.attr('placeholder','E.g Receipt Scan / Image')
        	},
        	
        	/*
        	 * Toggle readonly terms textarea
        	 */
        	changeTerms: function(e){
        		var choice = e.currentTarget.value,
        			textarea = $('#setup-tc textarea')
        			
        		console.log(choice)
        		
        		if( choice == 'standard' )
        			textarea.attr('readonly', 'readonly')
        		else
        			textarea.removeAttr('readonly')
        	},
        	
        	/* 
        	 * listener
        	 * allows add/remove the price field by keyboard
        	 */       	
        	addPriceByKey: function(e){
        		
        		var target = e.currentTarget;
        			
        		// ENTER / DOWN ARROW (add price field)
        		if( e.keyCode === 13 || e.keyCode === 40 ) {
        			
        			this.addPriceField( target )
        			
        		}
        		// UP ARROW (remove price field)
        		else if( e.keyCode === 38 ){
        			
        			this.removePriceField(target)
        			
        		}
        	},
        	
        	/* listener */
        	addPrice: function(e){
        		var target = e.currentTarget,
        			parent = $(target).parents('.setup-row-right');
        		this.addPriceField( $('.input-price', parent)[0] )
        		return false
        	},
        	
        	/* listener */
        	removePrice: function(e){
				var target = e.currentTarget
				this.removePriceField(target) 
				return false    		
        	},
        	
        	/* listener remove image price
        	removeImage: function(e){
        		var target = e.currentTarget
        		
        		console.log(target)
        		
        		$(target).prev().html('')
						 .parents('.setup-row-right').removeClass('showed')
        		return false
        	},
        	*/
        	
        	/* add price field */
        	addPriceField : function( target ){
        		
        		var self = this;
        		
        		// validation before cloning
    			var parent = $(target).parents('.setup-row-right')
    			if( !$(target).val().trim().length ){
        		
	        		$(target).tooltip({
	        			title:'Please enter the title',
	        			placement:'top'
	        		}).focus()
	        		
    				return
    			}
    			else if( !$('.uploaded-image img', parent).length ){
    				alert('Please choose an price image')
    				return
    			}
    			else if( this.rowsPrice == 6 ){
    				alert('Sorry, Maximum prices is 6')
    				return
    			}
    				
    			// last price field
    			var $lastPriceField = $(target).parents('#fieldset-price').find('.setup-row-right:last');
    			// new price field
    			var $newPriceField = $lastPriceField.clone()
    			
    			// remove button add field	
    			$('.setup-add', $lastPriceField).remove()
    			
    			// mapping selectors
    			$('input, .counter-limiter', $newPriceField)
    				.map(function(i,el){
				        switch( this.type ){
				            // input price text	
				          	case 'text':
				            	var counterLimiter = $('.counter-limiter strong', $newPriceField)
					            $(el).increaseIndex('id')
					                 .increaseIndex('name')
									 .val('')
									 .limiter(self.textLimiter.text, counterLimiter)
				            	break;
				            // input file select price image
				          	case 'file':
				            	$(el).increaseIndex('id')
				            	break;
				            // input hidden price image url	
				          	case 'hidden':
				            	$(el).increaseIndex('name')
									 .val('')
				            		 // remove uploaded image
				            		 .next().find('img').remove()
				            	break;
				        	// counter limiter
				          	default:
				            	$(el).increaseIndex('id')
				            	break;
				        }
			    	})
			    
			    // increase index ID then insert the new field
			    $newPriceField
			    	.increaseIndex('id')
			    	.removeClass('showed')
			    	.insertAfter($lastPriceField)
			    	.find('.input-price').focus()
					
				// increase rows price
    			this.rowsPrice++
        			
        		console.log('files after added', filesSelected)
        	},
        	
        	/* remove price field */
        	removePriceField: function( target ){
        		var $oldField = $(target).parents('.setup-row-right'),
    				  $parent = $($oldField).parent();
    				  
				var count   = $('.setup-row-right', $parent).length;
				var index 	= $('.setup-row-right', $parent).index($oldField);
				
				if( this.rowsPrice > 1 )
        		{
        			// decrease rows price
					this.rowsPrice--;
					
					var previousField = $oldField.prev()
					// set input focus previous row
					previousField.find('input').focus()
					if( index == this.rowsPrice ){
						// add setup-add button into previous row
						var setupAdd = $('.setup-add', $oldField)[0].outerHTML
						$(setupAdd)
							.insertAfter($('.setup-image', previousField))
					}	
					
					// reorder index attributes
					$parent.reorderIndex( $oldField, count, index, ['.setup-row-right', 'input', '.counter-limiter'] )
					
					// deleted files selected then reorder index
					// filesSelected = this._deleteReorder(filesSelected, index)
					this._deleteReorder(filesSelected, index)
					
					console.log('files after removed', filesSelected)
        		}
        	},
        	
        	_deleteReorder: function( obj, index ){
        		/*
        		var i = 0; var _k;
				var obj2 = {};
				for(k in obj){
					if( i != index ){
						_k = k.replace(/(\d+)/, function(fullMatch, n) {
							var _n = Number(n)
							return (_n > index) ? _n - 1 : _n
						})			
						obj2[_k] = obj[k];				
					}
					i++
				}
				*/
				
				console.log(index)
				
				obj.splice(index,1)
				
				$.map(obj,function(e,i){ 
					var name = e.name.replace(/(\d+)/, function(fullMatch, n) { 
						var _n = Number(n)
						return (_n > index) ? n - 1 : _n
					}) 
					e.name = name
					return e
				})
        	},
        	
        	selectImage: function(e){
        		var self 	  = this,
        		  	parentRow = $(e.currentTarget).parents('.setup-row-right'),
        		  	inputFile = $('input[type="file"]',parentRow),
        		  	readEl    = inputFile.siblings('.uploaded-image');
        		
        		console.log(inputFile[0])
				
				// define event listener by condition, 
				// if this action is add(new), the listener is fileReaderOnly
				// otherwise (update), fileReaderUpload
				var eventListener = ( this.model.isNew() ) ? self.fileReaderOnly : self.fileReaderUpload
        		
        		// handle change eventListener, then do click (input file)
        		inputFile.bind('change', { 
        			model:this.model, 
        			parent:parentRow, 
        			readEl:readEl 
        		}, eventListener).click()
        	},
        	
        	selectQuizImage: function(e){
        		var self 	  = this,
	        		wrapper   = $(e.currentTarget).parents('.quiz_image'),
	        		//quizClass = wrapper.hasClass('pic') ? 'quiz-pic' : 'quiz-video',
	        		uploadedRow = $('.uploaded-image', wrapper),
        		  	inputFile  = $('input[type="file"]', wrapper);
				
				// define event listener by condition, 
				// if this action is add(new), the listener is fileReaderOnly
				// otherwise (update), fileReaderUpload
				var eventListener = ( this.model.isNew() ) ? self.fileReaderOnly : self.fileReaderUpload
        		  	
	        	var	readEl    = uploadedRow,
	        		nameEl    = $('input.s1tfield', wrapper);
        		  	
        		// handle change eventListener, then do click (input file)
        		inputFile.bind('change', { 
        			model:this.model, 
        			parent:uploadedRow, 
        			readEl:readEl, 
        			nameEl:nameEl 
        		}, eventListener).click()
        	},
        	
        	/* upload the file image after selected, then read that image */
        	fileReaderUpload: function(e){
        		var target  = e.currentTarget,
        			parent  = e.data.parent,
        			model   = e.data.model,
        			readEl  = e.data.readEl,
        			nameEl  = e.data.nameEl;
        			
        		console.log('fileReaderUpload', e)
        		
        		var file = e.target.files[0];
        		
        		// File Reader
        		var reader = new FileReader
        		reader.onerror = this.errorHandler
        		// create loading spin
        		reader.onloadstart = function(evt){
        			parent.addClass('showed load')
        		}
        		// set image selected
        		reader.onloadend = (function(file){
        			return function(evt){
        				
        				console.log('File', file, 'Target', target, 'evt', evt)
        				
        				// upload utility Utils.js
        				Utils.upload(file, target.id, model, function(response){
        					
        					var $inputURL = $('#'+target.id).next();
	        				console.log($inputURL[0])
	        				$inputURL.val( response.url )
	        				
        					// create element img 
		        			var img = $('<img/>')
		        			// set img atrributes
		        			img[0].src = evt.target.result;
		        			img[0].title = file.name;
		        			
		        			// show image in 1 sec
		        			setTimeout(function(){
		        				// remove loading
		        				parent.removeClass('load')
		        				
		        				// remove img its exists
		        				if( $('img', readEl).length ){
		        					$('img', readEl).remove()
		        				}
		        				
		        				// show file name in input text
		        				if( nameEl ){
		        					nameEl.val(file.name)
		        				}
		        				
		        				// append child
								readEl.append(img)
		        					
		        				console.log('element', readEl[0])
		        				
		        			},1000)
        				})
        			}
        		})(file, target)
        		// read as Data URI
        		reader.readAsDataURL(file)
        	},
        	
        	/* read the file image live only after selected */
        	fileReaderOnly: function(e){
        		var target  = e.currentTarget,
        			parent  = e.data.parent,
        			readEl  = e.data.readEl,
        			nameEl  = e.data.nameEl;
        			
        		console.log('fileReaderOnly', e)
        		var file = e.target.files[0];
        		
        		console.log('file selected', file)
        		
        		// validation file image selected
        		if (! (file.type && file.type.match('image.*'))){ 
					// file type is not allowed 
					alert('Only JPG, PNG or GIF files are allowed');
					throw new Error('Only JPG, PNG or GIF files are allowed')
				}
				else if (! (file.size && file.size < 1048576)){ 
					// file size > 1MB
					alert('File is big!!');
					throw new Error('File is big!!')
				}
        		
        		// set file image selected 
        		// filesSelected[target.id] = file;
        		filesSelected.push({ name:target.id, file:file })
        		filesSize += file.size;
        		// filesCount++;
        		
        		console.log('files after selected', filesSelected)
        		console.log('filesSize', filesSize)
        		// console.log('filesCount', filesCount)
        		
        		// File Reader
        		var reader = new FileReader
        		reader.onerror = this.errorHandler
        		// create loading spin
        		reader.onloadstart = function(evt){
        			parent.addClass('showed load')
        		}
        		// set image selected
        		reader.onloadend = (function(file){
        			return function(evt){
	        			// create element img 
	        			var img = $('<img/>')
	        			// set img atrributes
	        			img[0].src = evt.target.result;
	        			img[0].title = file.name;
	        			
	        			// show image in 1 sec
	        			setTimeout(function(){
	        				// remove loading
	        				parent.removeClass('load')
	        				
	        				// remove img its exists
	        				if( $('img', readEl).length ){
	        					$('img', readEl).remove()
	        				}
	        				
	        				// show file name in input text
	        				if( nameEl ){
	        					nameEl.val(file.name)
	        				}
	        				
	        				// append child
							readEl.append(img)
	        					
	        				console.log('element', readEl[0])
	        			},1000)
        			}
        		})(file)
        		// read as Data URI
        		reader.readAsDataURL(file)
        	},
        	
        	errorHandler: function(e){
        		switch( e.target.error.code ) {
					case e.target.error.NOT_FOUND_ERR:
						alert('File not found!')
						break;
					case e.target.error.NOT_READABLE_ERR:
						alert('File is not readable')
						break;
					case e.target.error.ABORT_ERR:
						break;
					default:
						alert('An error occured reading this file')
				}
        	},
        	
        	beforeSave: function(){
        		var self = this
        		
        		console.log('beforeSave: uploadCompleted', uploadCompleted)
        		
        		// if is update, return save contest
        		if( uploadCompleted || !this.model.isNew() ){
        			this.saveContest()
        			return false
        		}
        		
        		console.log('files before save', filesSelected)
        		
        		// create upload progress
        		$('#container').addClass('loading upload');
        		$(this.progressBar).prepend('<div class="percent"></div>');
        		
        		console.log('progressBar', $(this.progressBar)[0])
        		
        		// multiple upload image from selected images
        		$.each(filesSelected, function(i,e){
        			/* callback */
        			self.uploadFile(e.file, e.name, {
        				// set upload url into input hidden (siblings)
        				set: function( url ){
	        				var $inputURL = $('#'+e.name).next();
	        				console.log($inputURL)
	        				$inputURL.val( url )
	        			},
	        			
        				// remove upload progress, then do save contest
        				complete: function(){
	        				setTimeout(function(){
	        					$('#container').removeClass('loading upload');
								$('.percent', $(self.progressBar)).html('')
								
								uploadCompleted = true
								console.log('uploadCompleted', uploadCompleted)
								
								self.saveContest()
							}, 1000)
	        			}
        			})
        		})
        		
        		return false
        		
        	},
        	
        	uploadFile: function( file, name, callback ){
        		
        		var self = this
        		
        		// object XMLHttpRequest
				var xhr = new XMLHttpRequest()
				
				// xhr response
				xhr.onload = function(){
					
					console.log('XHR load', this)
					
					// OK
					if( this.status == 200 )
					{
						// parse JSON response
						var response = JSON.parse(this.response)
						
						console.log('response', response)
						
						// calculate to create progress
						var _progress = Math.round((response.size / filesSize) * 100);
						// increase progress
						progress += _progress;
						progress = progress > 100 ? 100 : progress;
						
						console.log('loaded:%d, total:%d, progress:%d', response.size, filesSize, progress, filesSize)
						
						// show progress precent 
						$('.percent', $(self.progressBar)).html( progress + '%' )
						// set callback response		
						if( callback ) callback.set( response.url )
						// decrease files count
						// filesCount--;
						filesSelected.pop()
						
						console.log('%cfile decreased', 'background:#aaa;color:#bada55', filesSelected)
						
						if( filesSelected.length == 0 || progress > 100 ) {
							// callback complete 
							callback.complete()
						}
					}
					else
						console.error('Error!', 'An error occurred while uploading ' + file.name)
				}
				
				// xhr open
				xhr.open('POST', this.model.urlRoot + '/upload', true)
				
				// buat form data
				var formData = new FormData();
				formData.append('file', file)
				formData.append('name', name)
				
				// xhr send request
				xhr.send( formData )
        	},
        	
        	/*uploadImg: function( file, name, callback ){
        		
				this.upload(file, name, self.model, function(response){
        			
        			console.log('response', response)
						
					// calculate to create progress
					var _progress = Math.round((response.size / filesSize) * 100);
					// increase progress
					progress += _progress;
					progress = progress > 100 ? 100 : progress;
					
					console.log('loaded:%d, total:%d, progress:%d', response.size, filesSize, progress, filesSize)
					
					// show progress precent 
					$('.percent', $(self.progressBar)).html( progress + '%' )
					// set callback response		
					if( callback ) callback.set( response.url )
					// decrease files count
					filesCount--;
					console.log('%cfile count', 'background:#aaa;color:#bada55', filesCount)
					if( filesCount == 0 || progress > 100 ) {
						// callback complete 
						callback.complete()
					}
					
        		})
        		
        	},*/
        	
        	saveContest: function(){
        		
        		var self = this
        		var form = this.$('form'),
        			data = form.toJSON()
        			
        		console.log('data', data)

				this.model.save(data, {
					wait : true,
					success: function( resp ){
						console.info('Success')
						console.log( resp )
            			Utils.showMessage('success', "Contest saved successfully", function(){
            				app.navigate('#/contest')
            			})
					},
					error: function( err ){
						console.error('Error')
						console.log( err )
            			Utils.showMessage('error', "Error occured")
					}
				})	
				
				return false
        		
        	}
        })

        // Returns the View class
        return ContestSetupView;

    }

);