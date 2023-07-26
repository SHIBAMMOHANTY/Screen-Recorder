let recorder;
let stream;
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');
const recordedVideo = document.getElementById('recordedVideo');

// Function to handle the start of recording
async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    recorder = new RecordRTC(stream, { type: 'video' });
    recorder.startRecording();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (err) {
    console.error('Error accessing media devices: ', err);
  }
}

// Function to handle the stop of recording
function stopRecording() {
  recorder.stopRecording(() => {
    stream.getTracks().forEach(track => track.stop());
    recordedVideo.src = URL.createObjectURL(recorder.getBlob());
    downloadBtn.disabled = false; // Enable the download button after recording is stopped.
  });
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

// Function to handle video download
function downloadVideo() {
  const blob = recorder.getBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'recorded-video.webm'; // Change the filename as needed (e.g., .webm, .mp4, etc.)
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);

  // Disable the download button after the video has been downloaded
  downloadBtn.disabled = true;
}

// Event listeners for buttons
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
downloadBtn.addEventListener('click', downloadVideo);
