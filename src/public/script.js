// script.js
function updateUserCount(userCount) {
  document.getElementById('userCount').innerText = userCount;
}

const socket = io();
socket.on('userCountUpdated', updateUserCount);
// Handle button click event
document.getElementById('shareButton').addEventListener('click', () => {
     // Redirect to the chatbox page when the button is clicked
     window.location.href = '/chatbox';
});
