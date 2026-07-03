// ==========================================
// AEGIS LEGACY PROTOCOL - MAIN APP ROUTER
// ==========================================

const AegisSpamShield = require('./spamShield.js');
const aiIntegration = require('./ai-integration.js');
const proofOfReality = require('./proof-of-reality.js');
// const streamInterceptor = require('./stream-interceptor.js');

// Initialize the core services
const spamShield = new AegisSpamShield();

// Seed known spam signatures for active testing
spamShield.addSpamNumber("+12093324588");

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

      const isSpamDetected = spamShield.isSpam(incomingNumber);

      return res.writeHead(200).end(JSON.stringify({
        status: "SUCCESS",
        verified: !isSpamDetected,
        action: isSpamDetected ? "DROP_CALL" : "ALLOW_CALL",
        timestamp: Date.now()
      }));
    }

    // ─── ROUTE: AI ANALYSIS ENGINE ───
    if (url === '/api/analyze' && method === 'POST') {
      const { dataStream } = payload;

      if (!dataStream) {
        return res.writeHead(400).end(JSON.stringify({ error: "Missing dataStream payload." }));
      }

      // Process the stream via our secure automation/analysis model
      const aiResponse = await aiIntegration.processStream(dataStream);

      return res.writeHead(200).end(JSON.stringify(aiResponse));
    }

    // ─── ROUTE: PROOF OF REALITY VALIDATION ───
    if (url === '/api/verify-reality' && method === 'POST') {
      const { metadata } = payload;

      if (!metadata) {
        return res.writeHead(400).end(JSON.stringify({ error: "Missing metadata block for validation." }));
      }

      // Run stream signatures through the verification matrix
      const realityCheck = proofOfReality.verifyRealitySignature(metadata);

      return res.writeHead(200).end(JSON.stringify(realityCheck));
    }

    // ─── ROUTE: HEALTH CHECK / PROTOCOL STATUS ───
    if (url === '/api/status' || url === '/') {
      return res.writeHead(200).end(JSON.stringify({
        protocol: "Aegis Legacy Protocol",
        status: "OPERATIONAL",
        engines: ["SpamShield", "ProofOfReality", "AI-Integration"]
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
