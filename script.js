const users = [
    { username: 'user1', password: 'pass1', posts: ['Post 1 from User 1', 'Post 2 from User 1'] },
    { username: 'user2', password: 'pass2', posts: ['Post 1 from User 2', 'Post 2 from User 2'] },
    { username: 'user3', password: 'pass3', posts: ['Post 1 from User 3', 'Post 2 from User 3'] }
];

const likesMap = new Map();
const timelineCommentsMap = new Map();
const profileCommentsMap = new Map();
let username,password;

window.onload = function () {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        loggedInUser = JSON.parse(savedUser);
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('options').classList.remove('hidden');
        document.getElementById('user-name').innerText = loggedInUser.username;
        showTimeline();
    }
};

function login() {
    let data = JSON.parse(localStorage.getItem('users'));
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    console.log(data)
    if (data) {
        data.forEach((user) => {
            users.push(user)

        })
        console.log(users);
    }
    for(let i=0; i<users.length; i++)
        if (users[i].username == username && users[i].password == password) {
            alert('Login successful')
            showTimeline();
            document.getElementById('posts').classList.remove('hidden')
            return;
        }
            console.log('no user');
}

function Signup(event) {
    event.preventDefault();

     const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value
     const password = document.getElementById('new-password').value;
    const localStorage_users = JSON.parse(localStorage.getItem('users')) || [];

    let tempObj = { email: email, password: password, username: username, }
    localStorage_users.push(tempObj)
    // console.log(users)
    // console.log(tempObj)
    localStorage.setItem('users', JSON.stringify(localStorage_users))

    alert('Sign-up successful! You can now log in.');
    window.location.href = 'index.html';
};

function showTimeline() {
    if (!username && !password) {
        alert('Please log in first.');
        return;
    }

    document.getElementById('post-title').innerText = 'Timeline: Posts from other users';
    document.getElementById('posts').classList.remove('hidden');
    document.getElementById('post-list').innerHTML = '';

    users.forEach(user => {
        if (user.username !== username) {
// console.log(user.posts)
            user.posts?.map((post, index) => {
                createPostElement(user.username, post, index, 'timeline');
            });
        }
    });
}


function showProfile() {
    if (!username && !password) {
        alert('Please log in first.');
        return;
    }

    document.getElementById('post-title').innerText = 'Profile: Your posts';
    document.getElementById('posts').classList.remove('hidden');
    document.getElementById('post-list').innerHTML = '';
    user.forEach(user=>{

    
    user.posts.map((post, index) => {
        createPostElement(loggedInUser.username, post, index, 'profile');
    });
    });
}

// Create a post element
function createPostElement(username, post, index, viewType) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const content = document.createElement('p');
    content.innerText = `${username}: ${post}`;
    postDiv.appendChild(content);

    const likeCommentDiv = document.createElement('div');
    likeCommentDiv.classList.add('like-comment');

    const likeBtn = document.createElement('span');
    likeBtn.classList.add('like-btn');
    likeBtn.innerText = 'Like';
    likeBtn.onclick = () => likePost(index, viewType, username, postDiv);
    likeCommentDiv.appendChild(likeBtn);

    const likeCountSpan = document.createElement('span');
    likeCountSpan.innerText = 'Likes: 0';
    likeCommentDiv.appendChild(likeCountSpan);

    const commentBtn = document.createElement('span');
    commentBtn.classList.add('comment-btn');
    commentBtn.innerText = 'Comment';
    commentBtn.onclick = () => commentOnPost(index, viewType, postDiv, commentCountSpan);
    likeCommentDiv.appendChild(commentBtn);

    const commentCountSpan = document.createElement('span');
    commentCountSpan.innerText = 'Comments: 0';
    likeCommentDiv.appendChild(commentCountSpan);

    postDiv.appendChild(likeCommentDiv);
    document.getElementById('post-list').appendChild(postDiv);

    // Display previous comments if any
    const commentsMap = viewType === 'timeline' ? timelineCommentsMap : profileCommentsMap;
    const postComments = commentsMap.get(index) || [];
    postComments.forEach(comment => {
        const commentText = document.createElement('p');
        commentText.innerText = `Comment: ${comment}`;
        postDiv.appendChild(commentText);
    });
    const likeSet = likesMap.get(index);
    if (likeSet) {
        likeCountSpan.innerText = `Likes: ${likeSet.size}`;
    }

    commentCountSpan.innerText = `Comments: ${postComments.length}`;
}

function likePost(postIndex, viewType, username, postDiv) {
    if (!likesMap.has(postIndex)) {
        likesMap.set(postIndex, new Set());
    }

    const likeSet = likesMap.get(postIndex);
    const likeCountSpan = postDiv.querySelector('.like-comment span:nth-child(2)');

    if (likeSet.has(loggedInUser.username)) {
        likeSet.delete(loggedInUser.username);
        likeCountSpan.innerText = `Likes: ${likeSet.size}`;
    } else {

        likeSet.add(loggedInUser.username);
        likeCountSpan.innerText = `Likes: ${likeSet.size}`;
    }
}

function commentOnPost(postIndex, viewType, postDiv, commentCountSpan) {
    const commentInput = document.createElement('input');
    commentInput.placeholder = 'Add a comment...';
    commentInput.classList.add('comment-input');

    const submitComment = document.createElement('button');
    submitComment.innerText = 'Submit';
    submitComment.onclick = () => {
        if (commentInput.value.trim() !== '') {
            const commentText = document.createElement('p');
            commentText.innerText = `Comment: ${commentInput.value}`;
            postDiv.appendChild(commentText);

            const commentsMap = viewType === 'timeline' ? timelineCommentsMap : profileCommentsMap;
            if (!commentsMap.has(postIndex)) {
                commentsMap.set(postIndex, []);
            }
            commentsMap.get(postIndex).push(commentInput.value);

            commentCountSpan.innerText = `Comments: ${commentsMap.get(postIndex).length}`;
        }
        commentInput.remove();
        submitComment.remove();
    };

    postDiv.appendChild(commentInput);
    postDiv.appendChild(submitComment);
}

// Logout functionality
// function logout() {
//     localStorage.removeItem('loggedInUser');
//     window.location.reload(); // Refresh the page to return to the login screen
// }
