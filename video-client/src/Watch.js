import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

class Watch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endpoint: "http://localhost:4001"
        }
    }
    // send = () => {
    //     const socket = socketIOClient(this.state.endpoint);

    // }
    render() {

        const socket = socketIOClient(this.state.endpoint);

        socket.on('broadcaster', function () {
            console.log("got broadcaster");
            socket.emit('watcher');
        });


        socket.on('connect', function () {
            console.log('watcher by connect');
            socket.emit('watcher');
        });


        let peerConnection;
        //send clients sdpco
        socket.on('offer', function (id, description) {

            console.log("came offer")

            peerConnection = new RTCPeerConnection(null);
            peerConnection.setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(function () {
                    socket.emit('answer', id, peerConnection.localDescription);
                });
            peerConnection.onaddstream = function (event) {
                document.querySelector('video').srcObject = event.stream;
            };
            peerConnection.onicecandidate = function (event) {
                if (event.candidate) {
                    socket.emit('candidated', id, event.candidate);
                }
            };
        });

        socket.on('candidate', function (id, candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error(e));
        });

        return (
            <div> I am the watcher
                <div>
                    {/* <button onClick={() => this.send()}>Ask</button> */}
                    <video autoPlay playsInline></video>
                </div>
            </div>);
    }
}

export default Watch;