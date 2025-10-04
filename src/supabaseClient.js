// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hzsadtdwirisbsiwmijt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6c2FkdGR3aXJpc2JzaXdtaWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDY0NjgsImV4cCI6MjA3NTE4MjQ2OH0.oXoxLgO1WDcg65axRiLo2axVJPICla48mD_t41hKFh8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a test record
const testDatabase = async () => {
  // First, ask your friend to create the table in Supabase dashboard
  // Then you can insert data:
  
  const { data, error } = await supabase
    .from('connection_test')  // table name
    .insert({ message: 'Testing from Bolt!' })
    .select()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success! Data:', data)
  }
}

testDatabase()