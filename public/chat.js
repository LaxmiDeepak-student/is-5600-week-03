const form = document.querySelector('form');
const input = document.querySelector('#input');
const messages = document.querySelector('#messages');

// Handles form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const text = input.value.trim();
  if (text === '') return;

  fetch(`/chat?message=${encodeURIComponent(text)}`);
  input.value = '';
});

// Sets up Server-Sent Events (SSE) for real-time updates
const eventSource = new EventSource('/sse');

eventSource.addEventListener('message', (event) => {
  const message = document.createElement('li');
  message.textContent = event.data;
  messages.appendChild(message);
});
