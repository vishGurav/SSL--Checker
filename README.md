# SSL Checker

This is a simple application that checks SSL certificates for any domain, providing details like validity dates, expiration dates, issuer details, and subject details. It's built using the  Express, React, Node.js) and leverages the node-forge library for handling SSL certificate data.


   ***Technology Choices***
React: Chosen for the frontend due to its flexibility in building dynamic, responsive user interfaces.
Express.js: Used in the backend to handle requests and logic for retrieving SSL certificates.
Node.js: Chosen for the backend due to its asynchronous nature, which suits handling network requests efficiently.
Axios: Used for making HTTP requests between the frontend and backend.
node-forge: A powerful library for working with SSL certificates in Node.js.
Tailwind CSS: Selected for styling the frontend due to its utility-first design and responsiveness.


****Assumptions and Design Decisions********
Domain Input: We assume that users will input a valid domain name with or without the protocol (e.g., example.com or https://example.com).
API Design: The API is kept simple, with one endpoint that receives the domain and returns the SSL certificate information.
Security: Minimal security is implemented as this project is a simple demo. In production, you would implement additional security measures (e.g., rate limiting, input validation).


****Known Limitations or Areas for Improvement**
Error Handling: Currently, error handling is basic. It could be improved by providing more specific error messages (e.g., invalid domain, server not reachable).
UI/UX Improvements: The user interface is functional but could be enhanced with better design elements and improved responsiveness for various screen sizes.
Rate Limiting: In a production environment, rate limiting should be added to prevent abuse of the API.
SSL Certificate Types: At the moment, the app only retrieves basic SSL certificate details. Adding support for more complex details like SAN (Subject Alternative Names) could be a future improvement.
Testing: Unit and integration tests should be added to ensure the stability and reliability of the codebase.


## GitHub Repository

You can view and clone the project from this link: [SSL Checker Repository](https://github.com/vishGurav/SSL--Checker)

## Setup and Run Instructions

### Prerequisites

- *Node.js*: Ensure you have Node.js installed (version 14 or above recommended).
- *npm*: Node Package Manager is required to install dependencies.

### Backend Setup

1. *Clone the Repository*:
   ```bash
   git clone https://github.com/vishGurav/SSL--Checker.git
   cd SSL-CHECKER/backend
