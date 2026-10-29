const input = document.querySelector('.input');
const suggestedList = document.querySelector('.suggested-list');
const selectedList = document.querySelector('.selected-list');

function debounce (fn, delay) {
  let timer;
  return function () {
   clearTimeout(timer);
   timer = setTimeout(() => {
    fn();
    }, delay);
  }
}
// Fetch repository suggestions after the debounce delay.
const handleSearch = debounce (() => {
  let value = input.value.trim();

  const link = `https://api.github.com/search/repositories?q=${value}`;

  // Clear suggestions when the input is empty
  if(value.length === 0) {
    suggestedList.textContent = '';
    return;
  }

  fetch(link)
  .then(response => {

    // Handle unsuccessful HTTP responses.
    if(!response.ok) {
      throw new Error (`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    
    // Display only the first five repositories.
    let showItems = data.items;
    let suggestions = showItems.slice(0,5);
    suggestedList.textContent = '';
    suggestions.forEach(suggestion => {
      const name = suggestion.name;
      const eachName = document.createElement('li');
      eachName.className = 'each-name';
      eachName.append(name);
      suggestedList.append(eachName);


      // Add the selected repository to the list.
      eachName.addEventListener('click', () => {

         // Prevent the same repository from being added twice.
        for( const item of selectedList.children) {
          if(item.dataset.repoId === String(suggestion.id)) {
            return;
          }

          /*if (Number(item.dataset.repoId) === suggestion.id) {
            return;
          }*/
        }
        const eachItem = document.createElement('div');
        eachItem.className = 'each-item';

         // Create a card and store the repository ID for duplicate checking.
        eachItem.dataset.repoId = suggestion.id;

        // Create separate containers for repository details and the delete button.
        const details = document.createElement('div');
        details.className = 'details';
        const deleteBtn = document.createElement('div');
        
        const button = document.createElement('button');
        button.className = 'delete-btn';
        button.textContent = 'X';
        deleteBtn.append(button);

        // Remove the repository card when its delete button is clicked.

        button.addEventListener('click', () => {
          eachItem.remove();
        })

        const title = suggestion.name;
        const owner = suggestion.owner.login;
        const stars = suggestion.stargazers_count;

      
        
        details.innerHTML = `
        <p>Name: ${title}</p>
        <p>Owner: ${owner}</p>
        <p>Stars: ${stars}</p>
        `
        eachItem.append(details, deleteBtn);
        selectedList.append(eachItem);
        

        // Clear the input and suggestions after selection.
        input.value = '';
        suggestedList.textContent = '';
        
      })

    })
      
  })
  .catch (error => {
     // Log errors and clear the suggestions.
    console.log(`Failed to fetch repositories:`, error);
    suggestedList.textContent = '';
  })
}, 500);

input.addEventListener('input', handleSearch);

