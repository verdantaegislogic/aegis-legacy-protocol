class AegisSpamShield {
  constructor(size = 10007) {
    // Initialize a bit array (using a typed array for zero-cost memory footprint)
    this.size = size;
    this.bitArray = new Uint8Array(this.size);
  }

  // Simple, fast non-cryptographic hash functions for quick lookup
  _hash1(numberString) {
    let hash = 0;
    for (let i = 0; i < numberString.length; i++) {
      hash = (hash << 5) - hash + numberString.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % this.size;
  }

  _hash2(numberString) {
    let hash = 5381;
    for (let i = 0; i < numberString.length; i++) {
      hash = ((hash << 5) + hash) + numberString.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % this.size;
  }

  // Load known spam signatures into the local filter memory
  addSpamNumber(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/\D/g, ''); // Strip formatting
    this.bitArray[this._hash1(cleanNumber)] = 1;
    this.bitArray[this._hash2(cleanNumber)] = 1;
  }

  // Check an incoming call instantly before hitting any network APIs
  isSpam(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const idx1 = this._hash1(cleanNumber);
    const idx2 = this._hash2(cleanNumber);

    // If either bit is 0, the number is 100% NOT in the spam list
    if (this.bitArray[idx1] === 0 || this.bitArray[idx2] === 0) {
      return false; 
    }

    // If both bits are 1, it matches a signature (high probability of spam)
    return true; 
  }
}

// Example usage / Exporting for the Aegis engine
// const shield = new AegisSpamShield();
// shield.addSpamNumber("+12093324588"); 
// console.log(shield.isSpam("209-332-4588")); // Returns: true
module.exports = AegisSpamShield;
