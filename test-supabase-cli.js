const { execSync } = require('child_process');

const accessToken = 'sbp_79c83f7bf6f7e995a83ccc5f52cf63e46411d06a';

console.log('Attempting to connect to Supabase...');

try {
  const result = execSync(`npx supabase projects list --access-token ${accessToken}`).toString();
  console.log('Successfully connected to Supabase!');
  console.log(result);
} catch (error) {
  console.error('Error connecting to Supabase:');
  console.error(error.stderr?.toString() || error.message);
}
