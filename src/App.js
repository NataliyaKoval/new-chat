import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;
const CONNECTION_PORT = 'localhost:3002/';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');

  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, []);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList([...messageList, data]);
    })
  })

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit('join_room', room);
  }

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName,
        message: message
      }
    };
    await socket.emit('send_message', messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage('');
  }

  return (
    <div className="App">
      {
        !loggedIn ? (
            <div className="logIn">
              <div className="inputs">
                <input type="text" placeholder="Name" onChange={(e) => {setUserName(e.target.value)}}/>
                <input type="text" placeholder="Room" onChange={(e) => {setRoom(e.target.value)}}/>
              </div>
              <button onClick={connectToRoom}>Enter Chat</button>
            </div>
        ) : (
            <div className="chatContainer">
              <div className="messages">
                {messageList.map((val, key) => {
                  return (
                    <div key={key} className="messageItem" id={val.author === userName ? "you" : "other"}>
                      <div className="author">{val.author}</div>
                      <div>{val.message}</div>
                    </div>
                  )
                })}
              </div>

              <div className="messageInputs">
                <input type="text" placeholder="Message" onChange={(e) => {setMessage(e.target.value)}}/>
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
        )
      }
    </div>
  );
}

export default App;
