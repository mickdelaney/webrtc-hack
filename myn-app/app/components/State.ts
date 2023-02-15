import { atom } from 'recoil';
import KinesisVideo from 'aws-sdk/clients/kinesisvideo';
import KinesisVideoSignalingChannels from 'aws-sdk/clients/kinesisvideosignalingchannels';
import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc';

//------------------------------------------------------------------------------
function getRandomClientId() {
  return Math.random().toString(36).substring(2).toUpperCase();
}

// Used to determine / validate options in form components:
export const WebRtcOptions = {
  TRAVERSAL: {
    STUN_TURN: 'stunTurn',
    TURN_ONLY: 'turnOnly',
    DISABLED: 'disabled',
  },
  ROLE: {
    MASTER: 'MASTER',
    VIEWER: 'VIEWER',
  },
  RESOLUTION: {
    WIDESCREEN: 'widescreen',
    FULLSCREEN: 'fullscreen',
  },
};

export const webRtcState = atom({
  key: 'webRtcState', // unique ID (with respect to other atoms/selectors)
  default: {
    // These are config params set by the user:
    accessKey: '',
    secretAccessKey: '',
    sessionToken: '',
    region: 'us-west-2',
    role: WebRtcOptions.ROLE.MASTER,
    channelName: 'ScaryTestChannel',
    clientId: getRandomClientId(),
    endpoint: null,
    sendVideo: true,
    sendAudio: true,
    openDataChannel: true,
    resolution: WebRtcOptions.RESOLUTION.WIDESCREEN,
    natTraversal: WebRtcOptions.TRAVERSAL.STUN_TURN,
    useTrickleICE: false,
    messageToSend: '',
    playerIsStarted: false,

    // These are set when user starts video; a few of them are only used when you start the stream as MASTER:
    signalingClient: null,
    localStream: null,
    localView: null,
    remoteView: null,
    dataChannel: null,
    peerConnectionStatsInterval: null,
    peerConnectionByClientId: {},
    dataChannelByClientId: [],
    receivedMessages: '',
  }, // default value (aka initial value)
});
