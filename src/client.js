// Initialize the Socket.IO connection
const socket = io();

// Variables to store user input and reference DOM elements
let userName;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");

// Prompt the user for their name until a valid input is provided
do {
    userName = prompt("Please enter your name: ");
} while (!userName);

// Prompt the user for their channel until a valid input is provided
let channel;
do {
    channel = prompt("Please enter the channel you want to join: ");
} while (!channel);

// Join the channel
socket.emit('joinChannel', channel);

// Add an event listener to the textarea to detect when the Enter key is pressed
textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        // Send the message when Enter is pressed
        sendMessage(e.target.value);
    }
});

// Function to send a message
function sendMessage(message) {
    // Create a message object with user name and message content
    let msg = {
        user: userName,
        message: message.trim()
    };

    // Append the message to the message area with the 'outgoing' class
    appendMessage(msg, "outgoing");
    
    // Clear the textarea after sending the message
    textarea.value = "";

    // Scroll to the bottom of the message area to show the latest message
    scrollToBottom();

    // Emit the message to the server with the channel info
    socket.emit("message", { channel, msg });
}

// Function to append a message to the message area
function appendMessage(msg, type) {
    // Create a new div element for the message
    let mainDiv = document.createElement("div");
    // Add a class to the div based on the message type ('outgoing' or 'incoming')
    let className = type;
    mainDiv.classList.add(className, "message");

    // Set the inner HTML of the div with the message content
    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    
    // Append the new message div to the message area
    messageArea.appendChild(mainDiv);
}

// Listen for incoming messages from the server
socket.on("message", (msg) => {
    // Append the incoming message to the message area with the 'incoming' class
    appendMessage(msg, "incoming");
    
    // Scroll to the bottom to display the latest message
    scrollToBottom();
});

// Function to scroll to the bottom of the message area
function scrollToBottom() {
    // Set the scroll position to the bottom of the message area
    messageArea.scrollTop = messageArea.scrollHeight;
}
