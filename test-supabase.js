const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vzzkqxzyeexwfkgoxnyw.supabase.co';
const supabaseKey = 'sbp_79c83f7bf6f7e995a83ccc5f52cf63e46411d06a';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('todos')  // Replace with an actual table name
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Sample data:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

testConnection();
