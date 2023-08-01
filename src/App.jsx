import React, { useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "./assets/bootstrap/js/bootstrap.min.js";

import { CallEnd, MoreVert, FileCopy } from "@mui/icons-material";
import "./App.css";

// Initialize Firebase

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "webconf-60bc5.firebaseapp.com",
    projectId: "webconf-60bc5",
    storageBucket: "webconf-60bc5.appspot.com",
    messagingSenderId: "1022687823670",
    appId: "1:1022687823670:web:4d2eb80697f706b9ff9597",
    measurementId: "G-K29PPB02R3"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

// Initialize WebRTC
const servers = {
  iceServers: [
      {
          urls: [
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
          ],
      },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);

function App() {
  const [currentPage, setCurrentPage] = useState("py-4 py-xl-5");
  const [joinCode, setJoinCode] = useState("");

  return (
      <div className="app">
          {currentPage === "py-4 py-xl-5" ? (
              <Menu
                  joinCode={joinCode}
                  setJoinCode={setJoinCode}
                  setPage={setCurrentPage}
              />
          ) : (
              <Videos
                  mode={currentPage}
                  callId={joinCode}
                  setPage={setCurrentPage}
              />
          )}
      </div>
  );
}
function Menu({ joinCode, setJoinCode, setPage }) {
    return (
      <section className="py-4 py-xl-5">
        <div className="container">
          <div className="text-center p-4 p-lg-5" style={{ paddingTop: '33px', paddingBottom: '0px', marginBottom: '52px' }}>
            <p className="fw-bold text-primary mb-2">Proud to introduce</p>
            <h1 className="fw-bold mb-4">Video Conferencing App</h1>
            <button className="btn btn-light fs-5 py-2 px-4" onClick={() => setPage("create")}>Create Call</button>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <form className="d-flex justify-content-center flex-wrap" method="post" style={{ marginTop: '43px', paddingBottom: '0px', marginBottom: '87px' }}>
                <div className="mb-3">
                  <input className="form-control" type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Join with code..." />
                </div>
                <div className="mb-3">
                  <button className="btn btn-primary ms-2" onClick={() => setPage("join")}>Answer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <footer className="text-center py-4">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-3">
              <div className="col">
                <p className="text-muted my-2">Copyright&nbsp;© Mihir U</p>
              </div>
              <div className="col">
                <ul className="list-inline my-2">
                  <li className="list-inline-item me-4">
                    <div className="bs-icon-circle bs-icon-primary bs-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-facebook">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                    </div>
                  </li>
                  <li className="list-inline-item me-4">
                    <div className="bs-icon-circle bs-icon-primary bs-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-twitter">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                      </svg>
                    </div>
                  </li>
                  <li className="list-inline-item"></li>
                </ul>
              </div>
              <div className="col">
                <ul className="list-inline my-2">
                  <li className="list-inline-item"><a className="link-secondary" href="#">Privacy Policy</a></li>
                  <li className="list-inline-item"><a className="link-secondary" href="#">Terms of Use</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </section>
    );
  };

function Videos({ mode, callId, setPage }) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);

  const localRef = useRef();
  const remoteRef = useRef();

  const setupSources = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
      });
      const remoteStream = new MediaStream();

      localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
      });

      pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
              remoteStream.addTrack(track);
          });
      };

      localRef.current.srcObject = localStream;
      remoteRef.current.srcObject = remoteStream;

      setWebcamActive(true);

      if (mode === "create") {
          const callDoc = firestore.collection("calls").doc();
          const offerCandidates = callDoc.collection("offerCandidates");
          const answerCandidates = callDoc.collection("answerCandidates");

          setRoomId(callDoc.id);

          pc.onicecandidate = (event) => {
              event.candidate &&
                  offerCandidates.add(event.candidate.toJSON());
          };

          const offerDescription = await pc.createOffer();
          await pc.setLocalDescription(offerDescription);

          const offer = {
              sdp: offerDescription.sdp,
              type: offerDescription.type,
          };

          await callDoc.set({ offer });

          callDoc.onSnapshot((snapshot) => {
              const data = snapshot.data();
              if (!pc.currentRemoteDescription && data?.answer) {
                  const answerDescription = new RTCSessionDescription(
                      data.answer
                  );
                  pc.setRemoteDescription(answerDescription);
              }
          });

          answerCandidates.onSnapshot((snapshot) => {
              snapshot.docChanges().forEach((change) => {
                  if (change.type === "added") {
                      const candidate = new RTCIceCandidate(
                          change.doc.data()
                      );
                      pc.addIceCandidate(candidate);
                  }
              });
          });
      } else if (mode === "join") {
          const callDoc = firestore.collection("calls").doc(callId);
          const answerCandidates = callDoc.collection("answerCandidates");
          const offerCandidates = callDoc.collection("offerCandidates");

          pc.onicecandidate = (event) => {
              event.candidate &&
                  answerCandidates.add(event.candidate.toJSON());
          };

          const callData = (await callDoc.get()).data();

          const offerDescription = callData.offer;
          await pc.setRemoteDescription(
              new RTCSessionDescription(offerDescription)
          );

          const answerDescription = await pc.createAnswer();
          await pc.setLocalDescription(answerDescription);

          const answer = {
              type: answerDescription.type,
              sdp: answerDescription.sdp,
          };

          await callDoc.update({ answer });

          offerCandidates.onSnapshot((snapshot) => {
              snapshot.docChanges().forEach((change) => {
                  if (change.type === "added") {
                      let data = change.doc.data();
                      pc.addIceCandidate(new RTCIceCandidate(data));
                  }
              });
          });
      }

      pc.onconnectionstatechange = (event) => {
          if (pc.connectionState === "disconnected") {
              hangUp();
          }
      };
  };

  const hangUp = async () => {
      pc.close();

      if (roomId) {
          let roomRef = firestore.collection("calls").doc(roomId);
          await roomRef
              .collection("answerCandidates")
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      doc.ref.delete();
                  });
              });
          await roomRef
              .collection("offerCandidates")
              .get()
              .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      doc.ref.delete();
                  });
              });

          await roomRef.delete();
      }

      window.location.reload();
  };

  return (
      <div className="videos">
          <video
              ref={localRef}
              autoPlay
              playsInline
              className="local"
              muted
          />
          <video ref={remoteRef} autoPlay playsInline className="remote" />

          <div className="buttonsContainer">
              <button
                  onClick={hangUp}
                  disabled={!webcamActive}
                  className="hangup button"
              >
                  <CallEnd />
              </button>
              <div tabIndex={0} role="button" className="more button">
                  <MoreVert />
                  <div className="popover">
                      <button
                          onClick={() => {
                              navigator.clipboard.writeText(roomId);
                          }}
                      >
                          <FileCopy /> Copy joining code
                      </button>
                  </div>
              </div>
          </div>

          {!webcamActive && (
              <div className="modalContainer">
                  <div className="modal1">
                      <h3>
                          Turn on your camera and microphone and start the
                          call
                      </h3>
                      <div className="container2">
                          <button
                              onClick={() => setPage("py-4 py-xl-5")}
                              className="secondary"
                          >
                              Cancel
                          </button>
                          <button onClick={setupSources}>Start</button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
}

export default App;