const signUpForm = document.querySelector('form#sign-up');

signUpForm.addEventListener('submit', createUser);

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
