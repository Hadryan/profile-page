// Collection.js
// -------------
define(["jquery","backbone","models/Model", "utils"],

  function($, Backbone, Model, utils) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({
    	
      url: function(){
      	var base = APC.plugin_url + "/api/profile/contests",
      		options = this.options
      	return ( options.action ) ? base + '/' + options.action + '/' + options.value : base
      },

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Model,
      
      initialize: function( options ){
      	this.options = options || {}
      	this.on('all', function( event ){
      		console.log('%c[COLLECTION]', 'background:#222; color:#bada55;', 'url:', this.url(), '| options:', this.options, '| event:', event)
      	})
      	
      },
      
      // order by lastest start date
      comparator: function(model){
      	return new Date(model.get('start')).getTime()
      },
     
      getLastElement: function(){
      	return this.at(this.length - 1)
      },
      
      getElement: function(){
      	return this.currentElement
      },
      
      setElement: function(model) {
	    this.currentElement = model
	  },
      
      next: function(){
      	this.setElement(this.at(this.indexOf(this.getElement()) + 1));
    	return this;
      },
      
      prev: function(){
      	this.setElement(this.at(this.indexOf(this.getElement()) - 1));
    	return this;
      },
      
      getRecent: function(){
      	var lastest = this.getLastElement();
      	var lastestTime = new Date(lastest.get('end'));
      	var todayTime = new Date().setHours(0,0,0,0); 
      	
      	if( todayTime <= lastestTime )
      		return lastest
      		
      	return null
      },
      
      filterByMonth: function( month ){
      	var filtered = this.filter(function(contest){
      		var startMonth = new Date(contest.get('start')).getMonth()
      		return contest.get('start').indexOf(month) == 0
      	})
      	return new Collection(filtered)
      },
      
      filterByYear: function( year ){
      	var filtered = this.filter(function(contest){
      		var startMonth = new Date(contest.get('start')).getMonth()
      		return contest.get('start').lastIndexOf(year) == 6
      	})
      	return new Collection(filtered)
      }

    });

    // Returns the Model class
    return Collection;

  }

);