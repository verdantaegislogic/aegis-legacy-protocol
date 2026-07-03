// ==========================================
// AEGIS LEGACY PROTOCOL - MAIN APP ROUTER
// ==========================================

const AegisSpamShield = require('./spamShield.js');
// If you export your other modules, uncomment these as we wire them in:
// const aiIntegration = require('./ai-integration.js');
// const proofOfReality = require('./proof-of-reality.js');
// const streamInterceptor = require('./stream-interceptor.js');

// Initialize the core services
const spamShield = new AegisSpamShield();

// Main request handler (compatible with serverless Vercel routing)
module.exports = async (req, res) => {
  // Set up standard JSON headers
  res.setHeader('Content-Type', 'application/json');

  try {
    const { method, url } = req;
    
    // Parse out query parameters or request body
    let body = '';
    req.on('data', chunk => { body += chunk; });
    await new Promise(resolve => req.on('end', resolve));
    const payload = body ? JSON.parse(body) : {};

    // ─── ROUTE: INCOMING COMMUNICATION SCREENING ───
    if (url === '/api/screen-call' && method === 'POST') {
      const { incomingNumber } = payload;

      if (!incomingNumber) {
        return res.writeHead(400).end(JSON.stringify({ error: "Missing incomingNumber parameter." }));
      }

      // Run it through our low-cost local Bloom filter
      const isSpamDetected = spamShield.isSpam(incomingNumber);

      return res.writeHead(200).end(JSON.stringify({
        status: "SUCCESS",
        verified: !isSpamDetected,
        action: isSpamDetected ? "DROP_CALL" : "ALLOW_CALL",
        timestamp: Date.now()
      }));
    }

    // ─── ROUTE: HEALTH CHECK / PROTOCOL STATUS ───
    if (url === '/api/status' || url === '/') {
      return res.writeHead(200).end(JSON.stringify({
        protocol: "Aegis Legacy Protocol",
        status: "OPERATIONAL",
        engines: ["SpamShield", "ProofOfReality", "AI-Integration", "StreamInterceptor"]
      }));
    }

    // Route not found
    return res.writeHead(404).end(JSON.stringify({ error: "Route not found in core protocol architecture." }));

  } catch (error) {
    return res.writeHead(500).end(JSON.stringify({ 
      error: "Internal Protocol Execution Fault", 
      details: error.message 
    }));
  }
};
