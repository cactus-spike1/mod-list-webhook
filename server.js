const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/send-webhook', upload.single('modsFile'), async (req, res) => {
  const { loader, modsTitle, authorName, authorIconUrl, authorUrl, serverIp, webhookUrl } = req.body;
  let modsList = req.body.modsList;

  if (req.file) {
    modsList = fs.readFileSync(req.file.path, 'utf8');
  }

  modsList = modsList.split('\n').map((mod, index) => `${index + 1}. ${mod}`).join('\n');

  const jsonData = {
    "username": `сборщик | ${loader}`,
    "embeds": [
      {
        "title": modsTitle,
        "description": `\`\`\`${modsList}\`\`\``,
        "color": 47359,
        "author": {
          "name": authorName,
          "icon_url": authorIconUrl,
          "url": authorUrl
        },
        "fields": [
          {
            "name": "IP сервера Minecraft",
            "value": serverIp,
            "inline": true
          }
        ]
      }
    ]
  };

  try {
    await axios.post(webhookUrl, jsonData, { headers: { 'Content-Type': 'application/json' } });
    res.send('Список модов отправлен на вебхук Discord.');
  } catch (error) {
    res.status(500).send('Ошибка при отправке вебхука.');
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});