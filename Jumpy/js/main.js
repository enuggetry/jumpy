/*
Jumpy JBrowse plugin JS
*/

define([
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/Deferred',
            'dojo/dom-construct',
            'dijit/form/Button',
            'dojo/fx',
            'dojo/dom',
            'dojo/dom-style',
            'dojo/on',
            'dojo/query',
            'dojo/dom-geometry',
            'JBrowse/Plugin'
       ],
       function(
           declare,
           lang,
           Deferred,
           domConstruct,
           dijitButton,
           coreFx,
           dom,
           style,
           on,
           query,
           domGeom,
           JBrowsePlugin
       ) {
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        console.log("plugin Jumpy constructor");

        var browser = this.browser;
        var config = browser.config;

        var baseUrl = this._defaultConfig().baseUrl;
        var thisB = this;
        
        var queryParams = dojo.queryToObject( window.location.search.slice(1) );
        
        var trackId = null;
        var mousein = {};
        var jumpyUp = false;

        // create the hide/show button after genome view initialization
        browser.afterMilestone( 'initView', function() {

            console.log("config",config);
            for(var i in config.tracks) {
                if (config.tracks[i].jumpy) {
                    console.log("jumpy track", config.tracks[i].label);
                    trackId = 'track_'+config.tracks[i].label;
                    mousein[trackId] = false;

                }
            }

        });

        // trap the redraw event for handling resize, scroll and zoom events
        dojo.subscribe("/jbrowse/v1/n/tracks/redraw", function(data){
            
            require(["dojo/mouse", "dojo/on", "dojo/dom"], function(mouse, on, dom){
                if (trackId) {
                    on(dom.byId(trackId), mouse.enter, function(evt){
                        // handle mouse enter event
                        if (!mousein[trackId]) {
                            mousein[trackId] = true;
                            //var jumpyClass = '#'+trackId+' .jumpy_btn'
                            jumpyUp = dojo.query('.jumpy_btn',trackId );
                            console.log("mouse in jumpyUp",jumpyUp);
                            
                            if (typeof jumpyUp[0] === 'undefined')
                                dojo.place('<div class="jumpy_btn jumpy_left" />',trackId);
                        }
                    });
                    on(dom.byId(trackId), mouse.leave, function(evt){
                        // handle mouse leave event
                        if (mousein[trackId]) {
                            console.log("mouse out");
                            mousein[trackId] = false;
                        }
                    });
                }
            });
            
        });
    }

});
});

