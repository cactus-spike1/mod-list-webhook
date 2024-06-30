document.getElementById('webhookForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const formData = new FormData(this);
  const response = await fetch('/send-webhook', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    alert('Webhook sent successfully');
  } else {
    alert('Error sending webhook');
  }
});
