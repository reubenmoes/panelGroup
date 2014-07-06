# panelGroup

panelGroup is a jQuery plugin for creating simple tabs and accordions. But here's the real kicker, you can turn your tabs _into_ accordions. The intended use of this feature is for responsive sites where tabs might become less usable at smaller screen sizes.

## Use

For simplest use, just call `.panelGroup()` on your elements.

```javascript
$('.panel-group').panelGroup();
```

The following markup is assumed:

```html
<div class="panel-group" data-group-type="accordion" data-tab-nav-title="Choose a tab:">
  <div class="item">
    <h4 class="item-header">Item 1</h4>
    <div class="item-content">
      <p>Item content</p>
    </div><!-- .item-content -->
  </div><!-- .panel-group-item -->
  <div class="item">
    <h4 class="item-header">Item 2</h4>
    <div class="item-content">
    <p>Item content</p>
    </div><!-- .item-content -->
  </div><!-- .panel-group-item -->
  <div class="item">
    <h4 class="item-header">Item 3</h4>
    <div class="item-content">
    <p>Item content</p>
    </div><!-- .item-content -->
  </div><!-- .panel-group-item -->
</div><!-- .panel-group -->

```

A class of `item` for each tab/accordion item.`item-header` and `item-content` are used for the header and content. These can be changed in the options section though.

### data-group-type

Note that the group type (`accordion/tabs`), is specified in a data-group-type attribute on the containing element.

## Options

The following options are available, with defaults indicated:

```javascript
type: "auto", // options: tabs, accordion, auto (reads data attribute)
defaultType: 'tabs', // incase in invalid data attribute is provided
selectors: { // customize the classes used in markup
    item: '.item',
    header: '.item-header',
    content: '.item-content'
  },
flexTabNav: true, //Set to true to make tabs equal-width
tabNavClasses: '', //get's added to tab nav <ul>
tabItemsClasses: '', //get's added to tab-items div
openTabTrigger: 'focus click', //event used to open the tab
openAccordionTrigger: 'focus click', //event used to open the the accordion
accordionSpeed: 300, // The animation speed of opening/collapsing accordion items
firstAccordionOpen: true, // Whether or not the first accordion item should be open
onlyKeepOneOpen: true //If Accordion should collapse all other '.active' items on open
```

## Methods for changing types (used for responsive)

Methods are provided to turn tabs into accordions, and then to turn tabs back into tabs.

* `tabsToAccordions` turns tabs into accordions
* `tabsBackToTabs` turns tabs back into tabs after they've been turned into accordions

## Events triggered by panelGroup element

* `tabchange` when tab item is switched
* `accordionchange` when accordion item is opened (at end of transition)

Methods are called by passing in the method name as follows:

```javascript
$('.panel-group').panelGroup('tabsToAccordions');
```

The inteded use here is you use [Harvey.js](http://harvesthq.github.io/harvey/) or [enquire.js](http://wicky.nillia.ms/enquire.js/) to call `tabsToAccordions` at your small breakpoint, and then `tabsBackToTabs` once you leave that breakpoint again.
