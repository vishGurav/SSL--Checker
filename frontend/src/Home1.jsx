import React, { useState } from 'react';

function Home1() {
  const [domain, setDomain] = useState('');
  const [sslDetails, setSslDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateDomain = (domain) => {
    // Simple regex to validate domain
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
    return domainRegex.test(domain);
  };

  const checkSSL = async () => {
    setError('');
    setSslDetails(null);

    if (!domain) {
      setError('Please enter a domain name.');
      return;
    }

    if (!validateDomain(domain)) {
      setError('Invalid domain format. Please provide a valid domain.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/sslcheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSslDetails(data);
      } else {
        setError(data.error || 'An unexpected error occurred. Please check the domain and try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="border mt-20 p-8 max-w-lg mx-auto shadow-lg">
      <h1 className="text-2xl text-orange-500 font-bold mb-4 text-center sm:text-3xl">SSL Certificate Checker</h1>

      <input 
        type="text" 
        placeholder="Enter domain (e.g., example.com)" 
        value={domain} 
        onChange={(e) => setDomain(e.target.value)} 
        className="border border-gray-300 rounded p-2 w-full mb-4 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <button 
        onClick={checkSSL}
        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check SSL'}
      </button>

      {error && (
        <div className="text-red-500 mt-4 text-center">{error}</div>
      )}

      {sslDetails && (
        <div className="mt-4 p-4 border border-gray-300 rounded bg-white shadow-sm space-y-2">
          <h2 className="text-xl text-orange-500 font-bold my-2">SSL Certificate Details</h2>
          <p><strong>Is Valid :</strong> {sslDetails.valid ? 'Yes' : 'No'}</p>
          {/* <p><strong>Valid From:</strong> {sslDetails.validFrom}</p> */}
          <p><strong>Expiration date :</strong> {sslDetails.validTo}</p>
          <p><strong>Issuer:</strong> {sslDetails.issuer?.O || 'N/A'}, {sslDetails.issuer?.C || 'N/A'}, {sslDetails.issuer?.ST || 'N/A'}, {sslDetails.issuer?.L || 'N/A'}, {sslDetails.issuer?.CN || 'N/A'}</p>
          <p><strong>Subject:</strong> {sslDetails.subject?.CN || 'N/A'}</p>
          {/* <p><strong>Certificate Revoked:</strong> {sslDetails.revoked ? 'Yes' : 'No'}</p> */}
        </div>
      )}
    </div>
  );
}

export default Home1;
