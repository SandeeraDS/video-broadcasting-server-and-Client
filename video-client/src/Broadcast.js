import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
class Broadcast extends Component {



    constructor(props) {
        super(props);
        this.state = {
            endpoint: "http://localhost:4001",
            peerConnections: {},
            config: {
                'iceServers': [{
                    'urls': ['stun:stun.l.google.com:19302']
                }]
            }
        }
    }
    //invoke camera of the broadcaster
    componentDidMount() {
        window.startGetUserMedia();
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('broadcaster');
    }

    // //start sending broadcaster
    // send = () => {


    // }

    render() {

        const peerConnections = {};

        const socket = socketIOClient(this.state.endpoint);
        socket.on('watcher', function (id) {
            const peerConnection = new RTCPeerConnection(null);
            peerConnections[id] = peerConnection;
            console.log("id of the peer" + peerConnections[id]);
            peerConnection.addStream(document.querySelector('video').srcObject);
            peerConnection.createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(function () {
                    socket.emit('offer', id, peerConnection.localDescription);
                });
            peerConnection.onicecandidate = function (event) {
                if (event.candidate) {
                    socket.emit('candidate', id, event.candidate);
                }
            };
        });

        socket.on('answer', function (id, description) {
            peerConnections[id].setRemoteDescription(description);
        });

        socket.on('candidated', function (id, candidate) {
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        return (
            <div>I am the broadcaster
                 <h1>Realtime communication with WebRTC</h1>
                <video autoPlay playsInline></video>
                {/* <div>
                    <button onClick={() => this.send()}>Start Stream</button>
                </div> */}
            </div>);
    }
}

export default Broadcast;