// External script with leaks for testing
console.log('External script loaded');

// AWS Leak in external file
const AWS_CONFIG = {
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
};

// Stripe Leak in external file
const STRIPE_KEY = "sk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKl";

function initApp() {
  console.log('App initialized with keys:', AWS_CONFIG);
}
