// Init.js
// --------------

require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: APC.plugin_url + '/contest/backbone',

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // --------------
      "jquery": "libs/jquery",

      "jqueryui": "libs/jqueryui",

      "jquerylimiter": "libs/jquery.limiter",

      "underscore": "libs/lodash",

      "backbone": "libs/backbone-min",
      
      "spinner": "libs/spin.min",
      
      "utils": "libs/utils",
      
      // Plugins
      // -------
      "backbone.validateAll": "libs/plugins/Backbone.validateAll",

      "bootstrap": "libs/plugins/bootstrap",

      "text": "libs/plugins/text",
      
      "mediaelement": "libs/plugins/mediaelement-and-player.min",

      // Application Folders
      // -------------------
      "collections": "app/collections",

      "models": "app/models",

      "routers": "app/routers",

      "templates": "app/templates",

      "views": "app/views"

  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {

      // Twitter Bootstrap jQuery plugins
      "bootstrap": ["jquery"],

      // jQueryUI
      "jqueryui": ["jquery"],

      // jQuery Limiter
      "jquerylimiter": ["jquery"],
      
      // jQuery mediaelement
      "mediaelement": ["jquery"],
      
      // Utils
      "utils": ["jquery", "jqueryui", "spinner"],

      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery
        "deps": ["underscore", "jquery"],

        // Exports the global window.Backbone object
        "exports": "Backbone"

      },

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"]

  }

});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "utils", "spinner", "backbone", "routers/Router", "jqueryui", "bootstrap", "backbone.validateAll"],

  function($, utils, Spinner, Backbone, Router) {

	// center elements
	$('.spinner').center('#spin')
	$('.alert').center('#message')
	
	// scroll fixed
	$('#message').scrollFixed()
				
	// set active menu after clicked
	$('#submenu-tab a').click(function(){
		var href = $(this).attr('href')
		$('#submenu-tab a').removeClass('active')
		$(this).addClass('active')
	})
	
	// initialize utility
	Utils.init({
		// debugging
		// set true for development mode. 
		// set false for production mode
		debug: true, 
		// defines ajax loader element
		wrapperEl: '#container',
		loadingEl: '#loading',
		ajaxLoader: 'spin',
		Spinner: Spinner
	})
	
	// Define base url
	window.baseUrl = "http://localhost/backbone";
	
    // Instantiates a new Desktop Router instance
    window.app = new Router();

  }

);