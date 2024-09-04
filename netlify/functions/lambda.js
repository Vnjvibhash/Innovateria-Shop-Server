// Import the serverless-http package to wrap the Express app
import serverless from 'serverless-http';
import app from '../../index';

// Export the app as a handler to be used by Netlify Functions
export const handler = serverless(app);
