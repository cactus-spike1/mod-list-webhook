document.getElementById('webhookForm').addEventListener('submit', function (e) {
  const fileInput = document.getElementById('modsFile');
  const textArea = document.getElementById('modsList');

  if (fileInput.files.length === 0 && textArea.value.trim() === '') {
    e.preventDefault();
    alert('Пожалуйста, загрузите файл с модами или введите список модов вручную.');
  }
});
