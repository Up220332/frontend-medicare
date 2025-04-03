import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper, List, ListItem, ListItemText, Divider, TextField, Grid, } from '@mui/material';

const Messaging = () => {
  const [patients, setPatients] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchChats();
  }, []);

  const fetchPatients = async () => {
    const response = await fetch('/api/patients');
    const data = await response.json();
    setPatients(data); 
  };

  const fetchChats = async () => {
    const response = await fetch('/api/chats'); 
    const data = await response.json();
    setChats(data); 
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    const existingChat = chats.find((chat) => chat.patientId === patient.id);
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat = {
        id: chats.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        lastMessage: '',
        lastMessageTime: '',
        messages: [],
      };
      setChats([...chats, newChat]);
      setSelectedChat(newChat);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const message = {
        id: selectedChat.messages.length + 1,
        sender: 'Doctor',
        text: newMessage,
        timestamp: new Date().toLocaleString(),
      };
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, message],
        lastMessage: newMessage,
        lastMessageTime: new Date().toLocaleString(),
      };
      setChats(chats.map((chat) => (chat.id === selectedChat.id ? updatedChat : chat)));
      setSelectedChat(updatedChat);
      setNewMessage('');
    }
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Patients
            </Typography>
            <List>
              {patients.map((patient) => (
                <ListItem button onClick={() => handleSelectPatient(patient)} key={patient.id}>
                  <ListItemText
                    primary={patient.name}
                    secondary={<Typography variant="body2" color="text.secondary">Click to start a conversation</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedChat ? (
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Chat with {selectedChat.patientName}
              </Typography>
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
              Select a patient to start a conversation.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messaging;
