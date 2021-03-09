import React, { Component } from "react";
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "localhost:5005/";

export default class App extends Component {
    state = {
        connected: false,
        room: "",
        userName: "",
        message: "",
        messageList: [],
        data: ""
    };

    componentDidMount() {
        socket = io(CONNECTION_PORT);
    }

    componentDidUpdate() {
        socket.on("recieve_message", (data) => {
          if(data !== this.state.data){
            this.setState({
                messageList: [...this.state.messageList, data],
                data: data
            });
          }
        });
    }

    connectToRoom = () => {
        this.setState(
            {
                connected: true,
            },
            () => {
                socket.emit("join_room", this.state.room);
                console.log(socket);
            }
        );
    };

    sendMessage = async () => {
        let messageContent = {
            room: this.state.room,
            content: {
                author: this.state.userName,
                message: this.state.message,
            },
        };
        await socket.emit("send_message", messageContent);
        this.setState({
            messageList: [...this.state.messageList, messageContent.content],
            message: "",
        });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    render() {
        const { connected, room, userName, message, messageList } = this.state;
        return (
            <div className="App">
                {!connected ? (
                    <div className="logIn">
                        <div className="inputs">
                            <input
                                type="text"
                                placeholder="Name..."
                                name="userName"
                                onChange={(e) => {
                                    this.handleChange(e);
                                }}
                                value={userName}
                            />
                            <input
                                type="text"
                                placeholder="Room..."
                                name="room"
                                onChange={(e) => {
                                    this.handleChange(e);
                                }}
                                value={room}
                            />
                        </div>
                        <button onClick={this.connectToRoom}>Enter Chat</button>
                    </div>
                ) : (
                    <div className="chatContainer">
                        <div className="messages">
                            {messageList.map((val, key) => {
                                return (
                                    <div
                                        className="messageContainer"
                                        id={
                                            val.author === userName
                                                ? "You"
                                                : "Other"
                                        }
                                    >
                                        <div className="messageIndividual">
                                            {val.author}: {val.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="messageInputs">
                            <input
                                type="text"
                                placeholder="Message..."
                                name="message"
                                onChange={(e) => {
                                    this.handleChange(e);
                                }}
                                value={message}
                            />
                            <button onClick={this.sendMessage}>Send</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
