// Test script to verify cross-session messaging fixes
// Run this in the browser console after logging in

console.log('🧪 Testing cross-session messaging fixes...');

// Clear existing data first
localStorage.removeItem('cross_session_messages');
localStorage.removeItem('cross_session_chats');

// Create test messages between Hari and Priya
const testMessages = {
  'student-hari_student-priya': [
    {
      id: '1703601600000',
      fromUserId: 'student-hari',
      toUserId: 'student-priya',
      content: 'Hi Priya! How are your studies going?',
      type: 'text',
      timestamp: new Date().toISOString(),
      chatId: 'student-hari_student-priya',
      fromUserName: 'HARI HARA SUDHAN'
    },
    {
      id: '1703601660000',
      fromUserId: 'student-priya',
      toUserId: 'student-hari',
      content: 'Hi Hari! They\'re going well. How about yours?',
      type: 'text',
      timestamp: new Date().toISOString(),
      chatId: 'student-hari_student-priya',
      fromUserName: 'Priya Patel'
    }
  ]
};

// Store the test data
localStorage.setItem('cross_session_messages', JSON.stringify(testMessages));

console.log('✅ Test messages created:', testMessages);
console.log('');
console.log('🔍 Test Steps:');
console.log('1. Make sure you are logged in as HARI HARA SUDHAN');
console.log('2. Click the messaging icon to open MessagingModal');
console.log('3. Look for Priya Patel in the chat list');
console.log('4. Click on Priya Patel\'s chat');
console.log('5. You should see the test messages displayed');
console.log('6. Try sending a new message to verify it works');
console.log('');
console.log('📊 Expected Result: Messages should appear in the chat window instead of "No messages yet"');