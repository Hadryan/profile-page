// serialize object form data
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}; 

// form data to JSON
// http://stackoverflow.com/questions/8482705/is-there-a-better-way-to-update-a-backbone-model-before-sending-it-to-the-db#answer-8482854
$.fn.toJSON = function(options){

    options = $.extend({}, options);

    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push":     /^$/,
            "fixed":    /^\d+$/,
            "named":    /^[a-zA-Z0-9_]+$/
        };


    this.build = function(base, key, value){
        base[key] = value;
        return base;
    };

    this.push_counter = function(key, i){
        if(push_counters[key] === undefined){
            push_counters[key] = 0;
        }
        if(i === undefined){
            return push_counters[key]++;
        }
        else if(i !== undefined && i > push_counters[key]){
            return push_counters[key] = ++i;
        }
    };

    $.each($(this).serializeArray(), function(){

        // skip invalid keys
        if(!patterns.validate.test(this.name)){
            return;
        }

        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;

        while((k = keys.pop()) !== undefined){

            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            // push
            if(k.match(patterns.push)){
                merge = self.build([], self.push_counter(reverse_key), merge);
            }

            // fixed
            else if(k.match(patterns.fixed)){
                self.push_counter(reverse_key, k);
                merge = self.build([], k, merge);
            }

            // named
            else if(k.match(patterns.named)){
                merge = self.build({}, k, merge);
            }
        }

        json = $.extend(true, json, merge);
    });

    return json;
};

// centering element
$.fn.center = function( el ){
	if( !el ) el = window
	
	var center = ($(el).width() - this.width()) / 2;
	var top    = ($(el).height() - this.height()) / 2;
	
	this.css({
		position:'relative',
		top:top,
		left:center
	})
}

// increase index multiple
$.fn.increaseIndex = function( attribute ){
	$(this)
        .attr(attribute, function(index, _attr){
			return _attr.replace(/(\d+)/, function(fullMatch, n) {
				return Number(n) + 1
			})
		})
      
     return $(this)
}

// reorder index
$.fn.reorderIndex = function( fieldSelect, count, indexField, selectors ){
	
	var self = this;
	
	//var count 		= $(classChild, $(self)).length;
	//var indexField 	= $(classChild, $(self)).index(fieldSelect);
	
	var selectorsEl = selectors.join(', ');
		
	console.log('count:%d, indexField:%d, selectorsEl', count, indexField, selectorsEl)
	console.log('this', $(this))
	
	if(count > 1)
	{		
		// remove this field
		fieldSelect.remove()
		
		// map attributes
		$(selectorsEl, $(self))
			.each(function(i,e){
				if( e.id && $(this).attr('id').match(/(\d+)/) ) {
					 $(this)
						.attr('id', function(index, id){
							return id.replace(/(\d+)/, function(fullMatch, n) {
								var val = Number(n);
								return ( val > indexField ) ? val - 1 : val ;
							})
						})
				}
				if( e.name && $(this).attr('name').match(/(\d+)/) ) {
					 $(this)
						.attr('name', function(index, id){
							return id.replace(/(\d+)/, function(fullMatch, n) {
								var val = Number(n);
								return ( val > indexField ) ? val - 1 : val ;
							})
						})
				}
			})
	}
	
    return $(this)
}

// scroll element fixed
$.fn.scrollFixed = function () {
    var $this = this,
        $window = $(window);
    
    var position = $(this).position();
    var pos = position.top;

    $window.scroll(function(e){
        if ($window.scrollTop() > pos) {
            $this.css({
                position: 'fixed',
                top: 0
            });
        } else {
            $this.css({
                position: 'absolute',
                top: pos
            });
        }
    });
};

window.Utils = {
	
	defaults: {
		debug: true,
		consoleHolder: console,
		wrapperEl: '#container',
		loadingEl: '#loading',
		ajaxLoader: 'simple',
		Spinner: 'null'
	},
	
	init: function( options ){
		var defaults = this.defaults
		for( key in options ){
			if( defaults.hasOwnProperty(key) ){
				defaults[key] = options[key]
			}
		}
		
		this.debug()
		this.ajaxLoader.init()
	},
	
	// http://stackoverflow.com/questions/7042611/override-console-log-for-production
	debug: function(){
		if( !this.defaults.debug )
		{
	        console = {};
	        console.log   = function(){};
	        console.info  = function(){};
	        console.error = function(){};
	        console.warn  = function(){};
	    } 
	    else
	        console = this.defaults.consoleHolder;
	},
	
	ajaxLoader: {
		
		init: function(){
			this.el = Utils.defaults.loadingEl;
			if( Utils.defaults.ajaxLoader == 'simple' ){
				this.simple()
			} else {
				var Spinner = Utils.defaults.Spinner;
				if( 'null' != Spinner ){
					this.spin( Spinner )
				}else
					throw new Error('not found')
			}
		},
		
		// http://fgnass.github.com/spin.js/
		opts: {
			  lines: 15, // The number of lines to draw
			  length: 30, // The length of each line
			  width: 4, // The line thickness
			  radius: 40, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  color: '#FBB450', // #rgb or #rrggbb
			  speed: 0.8, // Rounds per second
			  trail: 36, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'auto', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px
		},
		
		spin: function( Spinner ){
			var target = document.querySelector(this.el);
			var spinner = new Spinner(this.opts).spin(target);
			
			$(target).ajaxStart(function(){ 
				console.info('ajaxStart')
				$(Utils.defaults.wrapperEl).addClass('loading')
			}).ajaxComplete(function(){ 
				console.info('ajaxStop')
				//if( $('.alert', this).hasClass('load') )
					$(Utils.defaults.wrapperEl).removeClass('loading')
			});
		},
		
		simple: function(){
			$(this.el).ajaxStart(function(){
				console.info('ajaxStart')
				$(Utils.defaults.wrapperEl).addClass('loading')
			}).ajaxStop(function(){
				console.info('ajaxStop')
				if( $('.alert', this).hasClass('load') )
					$(Utils.defaults.wrapperEl).removeClass('loading')
			})   
		}
	},
	
	showMessage: function(type, message, callback){
		var _class = 'alert-' + type;
		// remove loading
		$(this.defaults.wrapperEl).removeClass('loading')
		// show message
		$('.alert', this.defaults.wrapperEl)
			 .switchClass('load', _class, 0) // jquery ui switchClass
			 .html(message)  
			 .fadeOut(5000, function(){
    			$(this).switchClass(_class, 'load', 0)
    				   .html('loading')
    				   
    			if(callback) callback()
    			
    		 })
	},
	
	upload: function( file, name, model, callback ){
		
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
				if( callback ) callback(response)
			}
			else 
				throw new Error('An error occurred while uploading ' + file.name)
		}
		
		// xhr open
		xhr.open('POST', model.urlRoot + '/upload', true)
		
		// buat form data
		var formData = new FormData();
		formData.append('file', file)
		formData.append('name', name)
		formData.append('id', model.id)
		
		// xhr send request
		xhr.send( formData )
	},
	
	doCountDown: function( date, el ){
		var self = this;
		var endDate = this.parseDate(date, 'mm/dd/yyyy');
		var calcCountdown = setInterval(function(){
			
			self.setCountdown( date, el, function(){
				clearInterval(calcCountdown)
			})
			
	    },1000);
	},
	
	setCountdown: function( date, el, callback ){
		var endDate = this.parseDate(date, 'mm/dd/yyyy');
		
		var date_end = new Date(endDate.join(',')),
			date_now = new Date();
			
		var _seconds = Math.floor((date_end - (date_now))/1000),
			_minutes = Math.floor(_seconds/60),
			_hours   = Math.floor(_minutes/60);
		
		var days    = Math.floor(_hours/24),
			hours   = _hours - (days*24),
			minutes = _minutes-(days*24*60)-(hours*60),
			seconds = _seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
			
		if( days < 0 ){
			if( callback ) callback()
		}
	        
        $('#date-days', el).html(days)
        $('#date-hours', el).html(hours)
        $('#date-minutes', el).html(minutes)
        $('#date-seconds', el).html(seconds)
	},
		
	parseDate: function (input, format) {
	  	format = format || 'yyyy-mm-dd'; // default format
	  	var parts = input.match(/(\d+)/g), 
	      	i = 0, fmt = {};
	  	// extract date-part indexes from the format
	  	format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });
	
	  	return [parseInt(parts[fmt['yyyy']]), parseInt(parts[fmt['mm']]), parseInt(parts[fmt['dd']])]
	}
	
}
