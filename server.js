const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/send', (req, res) => {
  const { name, emails, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // use environment variable
      pass: process.env.EMAIL_PASSWORD, // use environment variable
    },
  });

  const mailOptions = {
    from: `${name}`, // Set the sender dynamically
    to: process.env.EMAIL, // use environment variable
    subject: `Contact from <${emails}>`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred: ', error);
      return res.status(500).send(error.toString());
    }
    console.log('Message sent: %s', info.messageId);
    res.status(200).send('Message sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
