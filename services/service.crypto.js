const { createHmac } = require('crypto');
const { Buffer } = require('buffer');

const header = JSON.stringify({
    alg: 'HS512',
    typ: 'JWT',
})
const encodedHeader = Buffer.from(header).toString('base64url');

exports.generateSalt = () => crypto.randomBytes(16).toString('hex');

exports.generateHash = (password, salt) => crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

exports.sign = (payload, secret) => {

    let updatedPayload = {
        ...payload,
        iss: 'SavEat',
        iat: Date.now(),
    };

    if(payload.exp >= 0)
        updatedPayload.exp = updatedPayload.iat + payload.exp

    const encodedPayload = Buffer.from(JSON.stringify(updatedPayload)).toString('base64url');

    const hmac = createHmac('sha512', secret);
    hmac.update(`${encodedHeader}.${encodedPayload}`);

    const signature = hmac.digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

exports.verify = (token, secret) => {
    let [header, payload, signature] = token.split('.');

    const hmac = createHmac('sha512', secret);
    hmac.update(`${header}.${payload}`);
  
    const givenSignature = hmac.digest('base64url');
  
    let decodedToken = {
        valid: false,
    };
    
    try {
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));

        if (givenSignature === signature && (decodedPayload.exp && Date.now() < decodedPayload.exp))
            decodedToken = {
                valid: true,
                payload: decodedPayload
            }
    
    } finally {
        return decodedToken;
    }
}