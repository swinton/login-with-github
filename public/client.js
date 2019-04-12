// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');

// Our GitHub App "slug"
const appSlug = 'plans';

// define variables that reference elements on our page
const statesForm = document.forms[0];
const stateInput = statesForm.elements['state'];

// listen for the form to be submitted and add a new dream when it is
statesForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const newState = stateInput.value;
  
  // reset form 
  stateInput.value = '';
  stateInput.focus();
  
  // redirect
  location.assign(`https://github.com/apps/${appSlug}/installations/new?state=${encodeURIComponent(newState)}`);
};

document.addEventListener("DOMContentLoaded", function() {
  console.log("👋");
});
