-- Create chat_messages table for persistent messaging
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  recipient_id TEXT, -- For private messages
  group_id TEXT, -- For group messages
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  file_attachment JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_recipient_id ON chat_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_group_id ON chat_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
-- Allow users to read messages they sent or received
CREATE POLICY "Users can read their own messages" ON chat_messages
  FOR SELECT USING (
    sender_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
    recipient_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- Allow users to insert their own messages
CREATE POLICY "Users can insert their own messages" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- Allow public access for demo purposes (you might want to restrict this in production)
CREATE POLICY "Allow public read access" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON chat_messages FOR INSERT WITH CHECK (true);

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON chat_messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();