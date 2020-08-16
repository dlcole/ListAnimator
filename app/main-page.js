/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

/*
NativeScript adheres to the CommonJS specification for dealing with
JavaScript modules. The CommonJS require() function is how you import
JavaScript modules defined in other files.
*/
const AnimationCurve = require("tns-core-modules/ui/enums").AnimationCurve;
const createViewModel = require("./main-view-model").createViewModel;

function onNavigatingTo(args) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    const page = args.object;

    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and JavaScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().

    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    page.bindingContext = createViewModel();
}

/*
Exporting a function in a NativeScript code-behind file makes it accessible
to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
file work.
*/
exports.onNavigatingTo = onNavigatingTo;

exports.onActionTap = function (args) {
  let page = args.object.page;
  let listview = page.getViewById("listview");

  listview.notifySwipeToExecuteFinished(); // close swipe actions 
  console.log("main-page.onActionTap...");
}

/**
 * Set limits for swipe so as to enable swipe actions
 * See: https://docs.nativescript.org/ui/components/RadListView/swipe-actions
 */
exports.onSwipeCellStarted = function (args) {
  const swipeLimits = args.data.swipeLimits;
  const swipeView = args.object;
  const rightItem = swipeView.getViewById('swipe-actions');
  swipeLimits.right = rightItem.getMeasuredWidth();
  swipeLimits.threshold = swipeLimits.right / 2;
}

exports.onAnimateTap  = function (args) {

  let page = args.object.page;
  let listview = page.getViewById("listview");

  let item = listview.getItemAtIndex(0);
  let itemView = listview.getViewForItem(item);

  var animate = async function () {

    await itemView.animate({ translate: { x: -176, y: 0 }, duration: 500, curve: AnimationCurve.easeOut, });
    await sleep(1000);

    await itemView.animate({ translate: { x: 0, y: 0 }, duration: 500, curve: AnimationCurve.easeIn, });
    await sleep(600);

  } // end animate

  animate()
    .then(() => { return; })
    .catch((e) => {
      console.log("main-page.onAnimateTap animation error: " + e);
    });

}

/**
* Wait for designated number of milliseconds
* @param {number} - time to wait, in milliseconds
* @return {Promise <void>} 
*/
var sleep = function (milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
