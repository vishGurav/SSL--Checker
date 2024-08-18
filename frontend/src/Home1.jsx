import React, { useState } from 'react';

function Home1() {
  const [domain, setDomain] = useState('');
  const [sslDetails, setSslDetails] = useState(null);
  const [error, setError] = useState('');

  const checkSSL = async () => {
    setError('');
    setSslDetails(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/sslcheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      if (response.ok) {
        setSslDetails(data);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
        // Check if error response exists and set the error message
        if (err.response) {
          setError(err.response.data.error || 'An unexpected error occurred.');
        } else {
          setError('Network error. Please try again later.');
        }
      }
  };

  return (
    // 
    <>
    
    <div className=" border mt-20 p-8 max-w-lg mx-auto shadow-lg">
  <h1 className="text-2xl font-h1 text-orange-500 font-bold mb-4 text-center  sm:text-3xl">SSL Certificate Checker</h1>
  
  <input 
    type="text" 
    placeholder="Enter domain" 
    value={domain} 
    onChange={(e) => setDomain(e.target.value)} 
    className="border border-gray-300 rounded p-2 w-full mb-4 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
  />
  <button 
    onClick={checkSSL}
    className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
  >
    Check SSL
  </button>

  {error && (
    <div className="text-red-500 mt-4 text-center">{error}</div>
  )}

  {sslDetails && (<>
    <div className="mt-4 p-4 border font-h1 border-gray-300 rounded bg-white shadow-sm space-y-2">
      <h2 className="text-xl text-orange-500 font-bold my-2">SSL Certificate Details</h2>
      <p ><strong>Is Valid:</strong> {sslDetails.valid ? 'Yes' : 'No'}</p>
      <p ><strong>Valid From:</strong> {sslDetails.validFrom}</p>
      <p ><strong>Valid To:</strong> {sslDetails.validTo}</p>
      <p ><strong>Issuer:</strong> {sslDetails.issuer.O},{sslDetails.issuer.C},{sslDetails.issuer.ST},{sslDetails.issuer.L},{sslDetails.issuer.CN}</p>
      <p ><strong>Subject:</strong> {sslDetails.subject.CN}</p>
    </div>
  </>
    
  )}
</div>

    </>
  );
}

export default Home1;
