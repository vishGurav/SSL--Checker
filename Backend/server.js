const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(express.json());
app.use(cors());

async function checkCertificate(domain) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      host: domain,
      port: 443,
      method: 'GET',
      secureProtocol: 'TLSv1_2_method', // Enforcing TLSv1.2
    }, (res) => {
      const cert = res.connection.getPeerCertificate();

      if (res.connection.authorized) {
        // Extract the common name (CN) and Subject Alternative Name (SAN) fields from the certificate
        const cn = cert.subject.CN;
        const altNames = cert.subjectaltname ? cert.subjectaltname.split(', ') : [];

        // Check if the domain matches either the CN or one of the SAN entries
        const isDomainValid = (cn === domain) || altNames.some(name => name === `DNS:${domain}`);
        console.log(`verified SSL certificate is valid for the domain:  ${isDomainValid}`);
        if (isDomainValid) {
          resolve({ chainValid: true, domainValid: true }); // Certificate chain is valid, and the domain matches
        } else {
          resolve({ chainValid: true, domainValid: false }); // Certificate chain is valid, but the domain does not match
        }
      } else {
        resolve({ chainValid: false, domainValid: false }); // Certificate chain is not valid
      }
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

app.post('/api/sslcheck', async (req, res) => {
  const { domain } = req.body;

  try {
    // Validate domain format
    new URL(`https://${domain}`);

    // Check if the certificate chain is valid and if the domain matches
    const { chainValid, domainValid } = await checkCertificate(domain);
    console.log(`checked certificate chain is valid: ${chainValid}`);
    if (!chainValid) {
      return res.status(400).json({ error: 'The SSL certificate chain is not valid.' });
    }

    if (!domainValid) {
      return res.status(400).json({ error: `The SSL certificate does not match the domain name: ${domain}.` });
    }

    https.get(`https://${domain}`, (response) => {
      const certificate = response.socket.getPeerCertificate();

      if (!certificate || !Object.keys(certificate).length) {
        return res.status(400).json({ error: 'No certificate was provided by the website.' });
      }

      // Extracting the certificate validity dates
      const validFrom = new Date(certificate.valid_from);
      const validTo = new Date(certificate.valid_to);
      const currentDate = new Date();

      // Check if the certificate is valid (within the date range)
      const isValid = currentDate >= validFrom && currentDate <= validTo;
      console.log(`ssl certificate isValid : ${isValid}`);
      if (!isValid) {
        return res.status(400).json({ error: `The SSL certificate for ${domain} has expired. Please check the certificate details.` });
      }

      // Preparing the response with certificate details
      const certDetails = {
        validFrom: certificate.valid_from,
        validTo: certificate.valid_to,
        issuer: certificate.issuer,
        subject: certificate.subject,
        valid: isValid,
        chainValid: chainValid,
        domainValid: domainValid
      };

      res.json(certDetails);
    }).on('error', (err) => {
      console.error('Error during SSL check:', err.message);
      if (err.message.includes('certificate has expired')) {
        res.status(400).json({
          error: `The SSL certificate for ${domain} has expired. Please check the certificate details.`
        });
      } else {
        res.status(500).json({ error: 'Network error. Please try again later.' });
      }
    });
  } catch (error) {
    console.error('Error during SSL check:', error.message);
    res.status(400).json({ error: `Error during SSL check: ${error.message}` });
  }
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
