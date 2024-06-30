const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send-webhook', upload.single('modsFile'), async (req, res) => {
  const {
    loader,
    modsTitle,
    authorName,
    authorIconUrl,
    authorUrl,
    serverIp,
    webhookUrl,
    modsList
  } = req.body;

  let fileContent = '';
  if (req.file) {
    fileContent = fs.readFileSync(req.file.path, 'utf8');
    fs.unlinkSync(req.file.path);
  } else if (modsList) {
    fileContent = modsList;
  }

  const data = {
    embeds: [
      {
        title: modsTitle,
        author: {
          name: authorName,
          icon_url: authorIconUrl,
          url: authorUrl,
        },
        fields: [
          { name: 'Loader', value: loader, inline: true },
          { name: 'Server IP', value: serverIp, inline: true },
          { name: 'Mods', value: fileContent || 'No mods provided' },
        ],
      },
    ],
  };

  try {
    await axios.post(webhookUrl, data);
    res.status(200).send('Webhook sent successfully');
  } catch (error) {
    console.error('Error sending webhook:', error);
    res.status(500).send('Error sending webhook');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
