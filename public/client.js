// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');

// our default state
const states = [];

// define variables that reference elements on our page
const statesList = document.getElementById('states');
const statesForm = document.forms[0];
const stateInput = statesForm.elements['state'];

// a helper function that creates a list item for a given dream
const appendNewState = function(state) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = state;
  statesList.appendChild(newListItem);
}

// iterate through every dream and add it to our page
states.forEach( function(state) {
  appendNewState(state);
});

// listen for the form to be submitted and add a new dream when it is
statesForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  states.push(stateInput.value);
  appendNewState(stateInput.value);

  // reset form 
  stateInput.value = '';
  stateInput.focus();
};
