/*!
* panelGroup 1.0-beta1
* 
* Written by Nathan Shubert-Harbison for Domain7 (www.domain7.com) - #humanizetheweb
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
* 
*/

(function($) {

	var pg = {
		defaults: {
			type: "auto", // options: tabs, accordion, auto (reads data attribute)
			defaultType: 'tabs',
			selectors: {
				item: '.item',
				header: '.item-header',
				content: '.item-content'
			},
			accordionSpeed: 300,
			firstAccordionOpen: true,
			onlyKeepOneOpen: true
		},
		settings: false,
		typeOptions: ['tab', 'accordion'],
		typeDefault: 'tab',
		originals: [],

		init: function(that) {

			return $(that).each(function(index) {

				// Store the original item key in a data attribute
				$(this).attr('data-group-original', index);

				// Cache the original element. This is for switching to a different group type.
				pg.originals.push($(this).clone().html());
			
				// Do the proper operation depending on grouping type
				switch ( pg.settings.type ) {
				
					case 'tabs':
						pg.makeTabs($(this));
						break;
				
					case 'accordion':
						pg.makeAccordion($(this));
						break;
					
					case 'auto':
				
						// Get the group type set in the group-type data attribute
						var type = $(this).data('group-type');
					
						// If the type set isn't valid use the default
						if ( pg.typeOptions.indexOf(type) == '-1' ) {
							type = 'tabs';
						}
					
						switch ( type ) {
							case 'tabs':
								pg.makeTabs($(this));
								break;
							case 'accordion':
								pg.makeAccordion($(this));
								break;
							default:
								break;
						}
					
						break;
				
					default:
						break;
				
				} // switch settings.type
			
			}); // reutrn that.each
		
		}, // init

		makeTabs: function(that) {

			// Create the markup neccesary for tabs
			
				that.addClass('tabs');

				// Header and items containers
				var nav = $('<ul class="tab-nav">'),
						navItems = [],
						navItemsWidth,
						items,
						content = $('<div class="tab-items">');

				// Iterate through each item and build the headers
				that.find(pg.settings.selectors.item).each(function(index) {
			
					// Header
					navItems.push('<li><a href="#" data-tab-index="' + index + '">' + $(this).find(pg.settings.selectors.header).text() + '</a></li>');
					var h = $(this).find(pg.settings.selectors.header).addClass('sr-only').hide();

					// Content
					content.append($(this).find(pg.settings.selectors.content).addClass('item').attr('data-tab-index', index).prepend(h));
					$(this).remove();
			
				});

				// Append header and content items
				nav.append(navItems);
				that.append(nav).append(content);

				// Calculate nav items widths
				nav.find(' > li').css('width', 100 / navItems.length + "%");

				//Add count class
				nav.addClass('has-'+navItems.length);

			// The functionality of tabs

				// Cache items, headers
				items = that.find('.tab-items');

				// Hide all but the first
				items.find('.item').not('[data-tab-index=0]').hide();
				nav.find('a').first().addClass('active');

				// Click handlers
				nav.find('a').on('click focus', function(event) {

					if ( ! $(this).is('.active') ) {

						// Get item to show
						var toShow = $(this).data('tab-index');

						// Show item, hide others
						items.find(pg.settings.selectors.item).not('[data-tab-index=' + toShow + ']').hide();
						items.find(pg.settings.selectors.item+'[data-tab-index=' + toShow + ']').show();

						// Toggle active class
						nav.find('.active').removeClass('active');
						$(this).addClass('active');

					} // ! active

					event.preventDefault();
									
				}); // a.click

		}, // makeTabs

		makeAccordion: function(that) {
		
			that.addClass('accordion');
		
			var items = that.find(pg.settings.selectors.item),
					activeItem,
					animating = false;

			// Check if first accordion item is open or not
			if ( pg.settings.firstAccordionOpen ) {
			
				// Hide items
				that.find(pg.settings.selectors.item + ":gt(0)").find(pg.settings.selectors.content).hide();

				// Active classes
				activeItem = items.first().addClass('active');
			
			} else {
			
				// Hide items
				that.find(pg.settings.selectors.item).find(pg.settings.selectors.content).hide();
			
			}
		

			// The click and toggle situation
			items.find(pg.settings.selectors.header).wrapInner('<a href="#">').children('a').on('click focus', function(event) {

				// Check if an animation is happening right now
				if ( animating ) {

					return false;

				} else {

					var t = $(this),
					    content = t.closest(pg.settings.selectors.item).find(pg.settings.selectors.content),
					    parent = t.closest(pg.settings.selectors.item);

					// Expand or collapse depending on if you clicked an active item or not
					if ( parent.is('.active') ) {
						// Don't close if it is just a focus event
						if( event.type == 'focus' ) {
							return;
						}

						// Close the active item
						animating = true;
						content.slideUp(pg.settings.accordionSpeed, function(){
							parent.removeClass('active');
							animating = false;
						});

					} else {
				
						// Close the items we don't want
						if ( pg.settings.onlyKeepOneOpen ) {
							activeItem = $(this).closest(pg.settings.selectors.item).siblings('.active');
							activeItem.find(pg.settings.selectors.content).slideUp(pg.settings.accordionSpeed, function(){
								activeItem.removeClass('active');
							});
						}
				
						// Open appropriate item
						parent.addClass('active');
						animating = true;
						content.slideDown(pg.settings.accordionSpeed, function(){
							animating = false;
						});

					} // else
			
					event.preventDefault();
				
				} // else if animating

			}); // header.click
		

		}, // makeAccordions

		methods: {
		
			tabsToAccordions: function(that) {

				// Check if we're dealing with tabs, if so, accordion time!
				if ( $(that).data('groupType') == 'tabs' ) {
				
					// Replace tab markup with original markup
					$(that).html(pg.originals[$(that).data('groupOriginal')]).removeClass('tabs');
				
					// Make into accordion
					pg.makeAccordion($(that));

					// Set whether we've turned tabs into accordions
					$(that).data('tabsToAccordion', 'true');
				
				} // if groupType == tabs

			}, // tabsToAccordions
		
			tabsBackToTabs: function(that) {

				if ( $(that).data('tabsToAccordion') ) {
				
					// Replace tab markup with original markup
					$(that).html(pg.originals[$(that).data('groupOriginal')]).removeClass('accordion');
				
					// Make into accordion
					pg.makeTabs($(that));

					// Set whether we've turned tabs into accordions
					$(that).data('tabsToAccordion', 'false');
				
				} // if tabsToAccordion
			
			} // tabsBackToTabs
		
		} // methods


	}; // pg

	$.fn.panelGroup = function(options) {

			// Check if we're instantiating plugin with options or calling a method. Normal stuff first.
			if ( !pg.methods[options] ) { 
			
				// Merge settings
				pg.settings = $.extend(pg.defaults, options);

				// Return main method
				var output = pg.init(this);
				return output;
			
			} else {

				return this.each(function(index) {
					pg.methods[options].apply(this, Array.prototype.slice.call($(this)));
				});
			}


	}; // panelGroup

}(jQuery));
