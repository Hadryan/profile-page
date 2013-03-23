// Model.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Model = Backbone.Model.extend({
        	
        	idAttribute: 'ID',
        	
        	urlRoot: window.baseUrl + "/profile-page/api",
        	
        	url: function(){
        		
        		var base = window.baseUrl + "/profile-page/api/profile/contests";
        		var options = this.options;
        		
        		// GET  : get recent contest => http://{SERVER_HOST}/api/profile/contests/recent
        		// POST : save contest		 => http://{SERVER_HOST}/api/profile/contests
        		if(this.isNew()) return ( _.isUndefined(options.action) ) ? base : base + '/' + options.action
        		
        		// GET/PUT/DELETE => http://{SERVER_HOST}/api/profile/contests/{:id}
        		return base + '/' + encodeURIComponent(this.id)
        	},

            // Model Constructor
            initialize: function( options ) {
            	this.options = options || {}
				this.on('all', function( event ){
					console.log('%c[MODEL]', 'background:#222; color:#bada55', "url :", this.url(), "event :", event)
				})
				
				console.log('Is New',this.isNew())
            },
			
            // Default values for all of the Model attributes
            defaults: {
				baseUrl: APC.plugin_url,
				logo: '',
            	start:'',
				end:'',
				title: '',
				prices:[
					{
						title: '',
						img: ''
					}
				],
				description: '',
				meta:{
					type: '',
					content: {
						question: '',
						thumbnail: {
							type: 'video',
							value: {
								video:{
									url: '',
									name: '',
									img: APC.plugin_url + '/contest/images/default.gif'
								},
								pic: {
									name: '',
									url: APC.plugin_url + '/contest/images/default.gif'
								}
							}							
						},
						choices:{
							a:'',
							b:'',
							c:'',
							d:'',
							e:''
						},
						answer: '',
						force: {
							type: true,
							value: ''
						}
					},
					subscribes: {
						facebook: {
							type: 1,
							value: 'http://facebook.com'
						},
						youtube: {
							type: 1,
							value: 'asiafoodrecipe'
						},
						twitter: {
							type: 1,
							value: 'asiafoodrecipe'
						},
						google_plus: {
							type: 1,
							value: 'http://asiafoodrecipe.com'
						}
					},
					fields: ['name','email','contact','address','blog']
				},
				terms: {
					type:'standard',
					value:'Terms & Conditions\nSweepstakes is open to any individual in Singapore with a valid mailing address. Limit one entry and prize per person, household, or e-mail address. The organizers reserve the right to change or add to the prizes and substitute them with a comparable alternative due to unforeseen circumstances or circumstances beyond their control.\n\nPrizes are non-transferable and no cash equivalent will be offered. Odds of winning depend on the number of eligible entries received. All terms and conditions of Facebook apply. This Sweepstakes is in no way sponsored, endorsed, or administered by, or associated with, Facebook. By submitting an entry, you understand that you are submitting your information to Sponsor and not to Facebook.'
				}
            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }            

        });

        // Returns the Model class
        return Model;

    }

);
