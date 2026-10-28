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

const handleSearch = debounce (() => {
  let value = input.value.trim();

  const link = `https://api.github.com/search/repositories?q=${value}`;
  if(value.length === 0) {
    suggestedList.textContent = '';
    return;
  }

  fetch(link)
  .then(response => {
    return response.json();
  })
  .then(data => {
    
    let showItems = data.items;
    let suggestions = showItems.slice(0,5);
    suggestedList.textContent = '';
    suggestions.forEach(suggestion => {
      const name = suggestion.name;
      const eachName = document.createElement('li');
      eachName.className = 'eachName';
      eachName.append(name);
      suggestedList.append(eachName);


      eachName.addEventListener('click', () => {
        const eachItem = document.createElement('div');
        eachItem.className = 'each-item';
        const details = document.createElement('div');
        details.className = 'details';
        const deleteBtn = document.createElement('div');
        
        const button = document.createElement('button');
        button.className = 'delete-btn';
        button.textContent = 'X';
        deleteBtn.append(button);

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
        

        input.value = '';
        
      })

    })
      
  })
}, 500);

input.addEventListener('input', handleSearch);

