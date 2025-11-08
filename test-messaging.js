// Test script for messaging functionality
import { supabaseDatabase } from './utils/supabase/database.js';

async function testMessaging() {
  console.log('🧪 Testing messaging functionality...');
  
  // Test 1: Check Supabase connection
  console.log('\n1. Testing Supabase connection...');
  const connectionTest = await supabaseDatabase.testConnection();
  console.log('Connection:', connectionTest ? '✅ Success' : '❌ Failed');
  
  // Test 2: Send a test message
  console.log('\n2. Testing message sending...');
  const testMessage = {
    sender_id: '2021wa15025',
    sender_name: 'Hari Kishan',
    sender_avatar: '',
    recipient_id: '2021wa15026', // Priya Patel
    content: 'Hello Priya! This is a test message.',
    message_type: 'text'
  };
  
  const sendResult = await supabaseDatabase.sendMessage(testMessage);
  console.log('Send message:', sendResult ? '✅ Success' : '❌ Failed');
  
  // Test 3: Fetch messages between users
  console.log('\n3. Testing message retrieval...');
  const messages = await supabaseDatabase.getPrivateMessages('2021wa15025', '2021wa15026');
  console.log(`Retrieved ${messages.length} messages:`, messages);
  
  return {
    connection: connectionTest,
    send: sendResult,
    messages: messages.length
  };
}

// Run test if called directly
if (typeof window === 'undefined') {
  testMessaging().then(result => {
    console.log('\n📊 Test Results:', result);
  }).catch(error => {
    console.error('❌ Test failed:', error);
  });
}

export { testMessaging };