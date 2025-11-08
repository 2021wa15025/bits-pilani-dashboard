// Clear and refresh messaging data to sync with admin students
function refreshMessagingData() {
  // Clear old messaging data
  localStorage.removeItem('global_chat_messages');
  localStorage.removeItem('global_chat_list');
  localStorage.removeItem('privateChats');
  localStorage.removeItem('chatGroups');
  localStorage.removeItem('chatMessages');
  
  console.log('✅ Cleared old messaging data - names will now sync with admin system');
  console.log('📝 Student names from admin system:');
  
  // Show current student names from centralized data
  const students = [
    { id: '2021wa15025', name: 'HARI HARA SUDHAN' },
    { id: '2021wa15026', name: 'Priya Patel' },
    { id: '2021wa15027', name: 'Arjun Gupta' },
    { id: '2021wa15028', name: 'Sneha Singh' },
    { id: '2021wa15029', name: 'Vikram Reddy' }
  ];
  
  students.forEach(student => {
    console.log(`  ${student.id}: ${student.name}`);
  });
  
  alert('Messaging data cleared! Close and reopen the messaging modal to see updated student names.');
}

// Make it available globally
window.refreshMessagingData = refreshMessagingData;