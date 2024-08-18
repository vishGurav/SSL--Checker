const express = require('express');
// const sslChecker = require('ssl-checker');
const cors = require('cors');
const https = require('https');
const forge = require('node-forge');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/sslcheck', (req, res) => {
    const { domain } = req.body;
    console.log(domain);
  
    // Validate domain format
    try {
      new URL(`https://${domain}`);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid domain format. Please provide a valid domain.' });
    }
  
    https.get(`https://${domain}`, (response) => {
      // Check for non-200 status codes
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: `Unable to retrieve SSL certificate. Status code: ${response.statusCode}` });
      }
  
      const certificate = response.socket.getPeerCertificate();
  
      if (!certificate || !Object.keys(certificate).length) {
        return res.status(400).json({ error: 'No certificate was provided by the website' });
      }
  
      // Extracting the certificate validity dates
      const validFrom = new Date(certificate.valid_from);
      const validTo = new Date(certificate.valid_to);
      const currentDate = new Date();
  
      // Check if the certificate is valid (within the date range)
      const isValid = currentDate >= validFrom && currentDate <= validTo;
  
      // Preparing the response with certificate details
      const certDetails = {
        validFrom: certificate.valid_from,
        validTo: certificate.valid_to,
        issuer: certificate.issuer,
        subject: certificate.subject,
        valid: isValid
      };
  
      res.json(certDetails);
    }).on('error', (err) => {
      // Handle network errors
      res.status(500).json({ error: 'Network error. Please try again later.' });
    });
  });


app.listen(8000, () => {
  console.log('Server running on port 8000');
});