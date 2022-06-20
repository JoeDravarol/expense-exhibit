// UI Components
const signUpComponent = () => {
  const markup = `
    <form id="sign-up" class="sign-up flow flex">
      <label for="username">Username:</label>
      <input id="username" name="username" type="text" placeholder="John Doe" required min="4" />
      <button>Sign Up</button>
    </form>
  `
  return markup;
}

const mobileTableComponent = user => {
  function tableRow(expense) {
    let markup = ``;

    for (let key in expense) { 
      if (key !== 'id') {
        markup += `
          <tr>
            <th>${key}</th>
            <td>${expense[key]}</td>
          </tr>
        `
      }
    }

    return markup;
  };

  function tableMarkup() {
    let markup = ``;

    for (let expense of user.expenses) {
      markup += `
        <table data-expenseId="${expense.id}">
          ${tableRow(expense)}
          <tr>
            <th>Action</th>
            <td class="expense-action">
              <button type="button" data-action="edit">
                <i class="ph-note-pencil"></i>
              </button>
              <button type="button" data-action="edit">
                <i class="ph-trash"></i>
              </button>
            </td>
          </tr>
        </table>
        `
    };

    return markup;
  }

  const markup = `
    <section id="mobile-table" class="container container--rounded-corner">
      <header>
        <h3>
          ${user.username}'s Expenses
        </h3>
      </header>

      <div class="expenses-container expenses-container--dashboard">
        ${tableMarkup()}
      </div>
    </section>
  `
  
  return markup;
}

const desktopTableComponent = user => {
  const thMarkup = () => {
    let markup = ``;
    
    for (let key in user.expenses[0]) {
      if (key !== 'id') {
        markup += `<th>${key}</th>`
      }
    }

    return markup;
  }

  const trMarkup = () => {
    let i = 0;
    const expenses = user.expenses;
    let markup = `<tr data-expenseId="${expenses[i].id}">`;
  
    for (; i < expenses.length; i++) {
      for (let key in expenses[i]) {
        if (key !== 'id') {
          markup += `<td>${expenses[i][key]}</td>`
        }
      }

      markup += `
        <td class="expense-action">
          <button type="button" data-action="edit">
            <i class="ph-note-pencil"></i>
          </button>
          <button type="button" data-action="delete">
            <i class="ph-trash"></i>
          </button>
        </td>
      `

      // Close tr
      markup += `</tr>`
    }

    return markup;
  }

  const markup = `
    <section id="desktop-table" class="expenses-container expenses-container--dashboard container container--rounded-corner">
      <table>
        <caption>
          ${user.username}'s Expenses
        </caption>

        <thead>
          <tr>
            ${thMarkup()}
            <th>
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          ${trMarkup()}
        </tbody>
      </table>
    </section>
  `

  return markup;
}

const expenseTableComponent = user => {
  const markup = `
    <article class="expense-table">
      ${mobileTableComponent(user)}
      ${desktopTableComponent(user)}
    </article>
  `;

  return markup;
}

const renderPage = async () => {
  const mainContainer = document.querySelector('main.dashboard');

  // Display signup form when not signed in
  if (!user) {
    mainContainer.insertAdjacentHTML('beforeend', signUpComponent());

    // Display user's UI
  } else {
    const response = await fetch(`/user/${user.uid}`);
    user = await response.json();
  
    if (user.expenses.length > 0) {
      mainContainer.insertAdjacentHTML('beforeend', expenseTableComponent(user));
    }
  }
}

// Event Handler
async function createUser(e) {
  e.preventDefault();
  
  try {
    const response = await fetch('/user', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'username': e.target.username.value
      })
    });
    const data = await response.json();

    localStorage.setItem('user', JSON.stringify(data))

    // Re-render page to show username
    location.replace('/dashboard');
  } catch(err) {
    console.error(err)
  }
}

renderPage()
const signUpForm = document.querySelector('form#sign-up');
signUpForm.addEventListener('submit', createUser);