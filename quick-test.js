// Simple test for messaging modal fixes
// Open browser console and run this script

console.log('🔧 Testing messaging fixes...');

// Test 1: Set up simple test data
const testData = {
  'student-hari_student-priya': [
    {
      id: 'test1',
      fromUserId: 'student-hari', 
      toUserId: 'student-priya',
      content: 'Hi Priya! How are you?',
      type: 'text',
      timestamp: new Date().toISOString(),
      fromUserName: 'HARI HARA SUDHAN'
    },
    {
      id: 'test2',
      fromUserId: 'student-priya',
      toUserId: 'student-hari', 
      content: 'Hi Hari! I am doing well, thanks!',
      type: 'text',
      timestamp: new Date().toISOString(),
      fromUserName: 'Priya Patel'
    }
  ]
};

// Store the test data
localStorage.setItem('cross_session_messages', JSON.stringify(testData));

console.log('✅ Test data created');
console.log('📋 Next steps:');
console.log('1. Refresh the page or restart the app');
console.log('2. Login as HARI HARA SUDHAN');
console.log('3. Open messaging modal');
console.log('4. Check if Priya appears in chat list WITH email');
console.log('5. Click on Priya to open chat');
console.log('6. Verify messages appear in WhatsApp style (your messages on right, received on left)');
console.log('7. Check if dialog content stays within boundaries');