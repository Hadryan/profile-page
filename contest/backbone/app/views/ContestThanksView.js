// ContestThanksView.js
// -----------------------
define(["jquery", "backbone", "utils", "models/Model", "collections/Collection", "text!templates/ContestThanks.html"],

	function($, Backbone, utils, Model, Collection, template){
		
		var ContestThanksView = Backbone.View.extend({
			
			el: '#contest-wrapper',
			
			template: _.template( template ),
			
			initialize: function(){
				
				console.log('ContestThanksView', this.model.toJSON() )
				
				
				this.listenTo(this.model, 'destroy', this.remove);
				
			},
			
			render: function(){
				
				// https://developers.facebook.com/docs/reference/javascript/
				window.fbAsyncInit = function() {
					// init the FB JS SDK
					FB.init({
						appId : '382996781797796', // App ID from the App Dashboard
						status : true, // check the login status upon init?
						cookie : true, // set sessions cookies to allow your server to access the session?
						xfbml : true // parse XFBML tags on this page?
					});
				};
				
				// Load the SDK's source Asynchronously
				// Note that the debug version is being actively developed and might
				// contain some type checks that are overly strict.
				// Please report such bugs using the bugs tool.
				( function(d, debug) {
					var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
					if (d.getElementById(id)) {
						return;
					}
					js = d.createElement('script');
					js.id = id;
					js.async = true;
					js.src = "//connect.facebook.net/en_US/all" + ( debug ? "/debug" : "") + ".js";
					ref.parentNode.insertBefore(js, ref);
				}(document, /*debug*/false));
				
				var data = this.model.toJSON()
				data['share'] = 'Check this out !! Contest "' + this.model.get('title') + '"'
				
				$(this.el).html( this.template(data) )
				
				return this.el
			},
			
			events: {
				"click .fb-share" 		: "fbShare",
				"click .twitter-share" 	: "twitterShare",
			},
		
			fbShare: function() {
				var self = this
				
				var startDateObj = Utils.parseDate(this.model.get('start'), 'mm/dd/yyyy')
					startDate = $.datepicker.formatDate(
						'M, d yy', 
						new Date(startDateObj[1], startDateObj[1], startDateObj[2]));
						
				FB.ui({
					method: 'feed',
				    caption: 'Contest asiafoodrecipe started on ' + startDate,
				    description: self.model.get('description'),
				    link: self.model.get('baseUrl') + '/#contest',
				    picture: self.model.get('logo')
				}, function(response) {
					if (response && response.post_id) {
						Utils.showMessage('success', 'Post was published.');
					} else {
						Utils.showMessage('error', 'Post was not published.');
					}
				});
			},
		
			twitterShare: function(e) {
				var a= 'http://twitter.com/home?status=Check this out !! Contest "' + this.model.get('title') + '"',
					b = "scrollbars=yes,resizable=yes,toolbar=no,location=yes", 
					c = 550, d = 420, 
					e = screen.height, f = screen.width, 
					g = Math.round(f / 2 - c / 2), 
					h = 0;
				return e > d && ( h = Math.round(e / 2 - d / 2)), 
				window.open(a, null, b + ",width=" + c + ",height=" + d + ",left=" + g + ",top=" + h)
			}
		})
		
		return ContestThanksView
		
	}

)
