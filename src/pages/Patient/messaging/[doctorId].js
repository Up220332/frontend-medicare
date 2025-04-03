import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Paper, TextField, Button, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';

const Messaging = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const router = useRouter();

  const fetchChats = useCallback((doctorId) => {
    const existingChat = chats.find((chat) => chat.doctorId === doctorId);
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat = {
        id: chats.length + 1,
        doctorId,
        messages: [],
      };
      setChats([...chats, newChat]);
      setSelectedChat(newChat);
    }
  }, [chats]); // Add chats as dependency since it's used inside the callback

  useEffect(() => {
    const { doctorId } = router.query; 
    if (doctorId) {
      setDoctorId(doctorId);
      fetchChats(doctorId);
    }
  }, [router.query, fetchChats]); // Now fetchChats is stable between renders

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const message = {
        id: selectedChat.messages.length + 1,
        sender: 'Patient',
        text: newMessage,
        timestamp: new Date().toLocaleString(),
      };
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, message],
      };
      setChats(chats.map((chat) => (chat.id === selectedChat.id ? updatedChat : chat)));
      setSelectedChat(updatedChat);
      setNewMessage('');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chat with Dr. {doctorId}
      </Typography>

      {selectedChat ? (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {selectedChat.messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem>
                  <ListItemText
                    primary={message.sender}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {message.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {message.timestamp}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Paper>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No chat history with this doctor.
        </Typography>
      )}
    </Container>
  );
};

export default Messaging;