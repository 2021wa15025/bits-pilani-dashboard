// Sample test script to populate cross-session messages
// This can be run in the browser console to test the messaging system

console.log('🧪 Setting up test data for cross-session messaging...');

// Clear any existing data
localStorage.removeItem('cross_session_messages');
localStorage.removeItem('cross_session_chats');

// Import the cross-session messaging functionality (simulation)
const testMessages = {
    'student-hari_student-priya': [
        {
            id: '1703601600000',
            fromUserId: 'student-hari',
            toUserId: 'student-priya',
            content: 'Hi Priya! How are your studies going?',
            type: 'text',
            timestamp: '2024-01-26T10:00:00.000Z',
            chatId: 'student-hari_student-priya',
            fromUserName: 'HARI HARA SUDHAN'
        },
        {
            id: '1703601660000',
            fromUserId: 'student-priya',
            toUserId: 'student-hari',
            content: 'Hi Hari! They\'re going well. How about yours?',
            type: 'text',
            timestamp: '2024-01-26T10:01:00.000Z',
            chatId: 'student-hari_student-priya',
            fromUserName: 'Priya Patel'
        },
        {
            id: '1703601720000',
            fromUserId: 'student-hari',
            toUserId: 'student-priya',
            content: 'Great! Want to study together for the upcoming exam?',
            type: 'text',
            timestamp: '2024-01-26T10:02:00.000Z',
            chatId: 'student-hari_student-priya',
            fromUserName: 'HARI HARA SUDHAN'
        }
    ],
    'student-arjun_student-hari': [
        {
            id: '1703601780000',
            fromUserId: 'student-arjun',
            toUserId: 'student-hari',
            content: 'Hey Hari! Can I join your study group?',
            type: 'text',
            timestamp: '2024-01-26T10:03:00.000Z',
            chatId: 'student-arjun_student-hari',
            fromUserName: 'Arjun Gupta'
        },
        {
            id: '1703601840000',
            fromUserId: 'student-hari',
            toUserId: 'student-arjun',
            content: 'Of course Arjun! The more the merrier.',
            type: 'text',
            timestamp: '2024-01-26T10:04:00.000Z',
            chatId: 'student-arjun_student-hari',
            fromUserName: 'HARI HARA SUDHAN'
        }
    ]
};

const testChats = {
    'student-hari': [
        {
            id: 'student-priya',
            name: 'Priya Patel',
            type: 'private',
            lastMessage: 'Great! Want to study together for the upcoming exam?',
            timestamp: '2024-01-26T10:02:00.000Z',
            avatar: 'https://ui-avatars.com/api/?name=Priya%20Patel&background=007cba&color=fff'
        },
        {
            id: 'student-arjun',
            name: 'Arjun Gupta',
            type: 'private',
            lastMessage: 'Of course Arjun! The more the merrier.',
            timestamp: '2024-01-26T10:04:00.000Z',
            avatar: 'https://ui-avatars.com/api/?name=Arjun%20Gupta&background=007cba&color=fff'
        }
    ],
    'student-priya': [
        {
            id: 'student-hari',
            name: 'HARI HARA SUDHAN',
            type: 'private',
            lastMessage: 'Great! Want to study together for the upcoming exam?',
            timestamp: '2024-01-26T10:02:00.000Z',
            avatar: 'https://ui-avatars.com/api/?name=HARI%20HARA%20SUDHAN&background=007cba&color=fff'
        }
    ],
    'student-arjun': [
        {
            id: 'student-hari',
            name: 'HARI HARA SUDHAN',
            type: 'private',
            lastMessage: 'Of course Arjun! The more the merrier.',
            timestamp: '2024-01-26T10:04:00.000Z',
            avatar: 'https://ui-avatars.com/api/?name=HARI%20HARA%20SUDHAN&background=007cba&color=fff'
        }
    ]
};

// Store the test data
localStorage.setItem('cross_session_messages', JSON.stringify(testMessages));
localStorage.setItem('cross_session_chats', JSON.stringify(testChats));

console.log('✅ Test data setup complete!');
console.log('📨 Messages:', testMessages);
console.log('💬 Chats:', testChats);
console.log('');
console.log('🧪 Test Instructions:');
console.log('1. Login as HARI HARA SUDHAN - you should see chats with Priya and Arjun');
console.log('2. Login as Priya Patel - you should see chat with Hari');
console.log('3. Login as Arjun Gupta - you should see chat with Hari');
console.log('4. Send messages between accounts to test real-time communication');
console.log('');
console.log('🔍 Note: Student names now match admin system exactly:');
console.log('- HARI HARA SUDHAN (not Hari Sharma)');
console.log('- Priya Patel');
console.log('- Arjun Gupta (not Arjun Sharma)');