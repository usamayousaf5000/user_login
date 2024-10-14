// function Signup(event) {
//     event.preventDefault();

//     const username = document.getElementById('new-username').value;
//     const email = document.getElementById('new-email').value
//     const password = document.getElementById('new-password').value;
//     const users = JSON.parse(localStorage.getItem('users')) || [];

//     let tempObj = { email: email, password: password, username: username, }
//     users.push(tempObj)
//     // console.log(users)
//     // console.log(tempObj)
//     localStorage.setItem('users', JSON.stringify(users))

//     alert('Sign-up successful! You can now log in.');
//     window.location.href = 'index.html';
// };
