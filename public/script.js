document.addEventListener('DOMContentLoaded', () => {
  loadVideos();
});

function loadVideos() {
  const videoList = document.getElementById('videoList');
  videoList.innerHTML = '';
  fetch('data.json')
    .then((response) => response.json())
    .then((data) => {
      data.videos.forEach((videoData) => {
        const videoItem = document.createElement('div');
        videoItem.className =
          'flex flex-col items-center w-72 bg-gray-100 rounded-lg shadow-md p-4 mb-4';

        videoItem.innerHTML = `
              <img src="${videoData.thumb}" data-video="${videoData.video}" class="w-full object-cover rounded cursor-pointer mb-2" onclick="openModal(this)" alt="${videoData.title}">
              <div class="text-lg font-bold">${videoData.title}</div>
            `;

        videoList.appendChild(videoItem);
      });
    })
    .catch((error) => {
      console.error('Error loading videos:', error);
    });
}

function openModal(videoElement) {
  const modal = document.getElementById('modal');
  const video = document.getElementById('video');
  const videoSrc = videoElement.getAttribute('data-video');

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  } else {
    console.error('HLS not supported in this browser');
  }

  modal.classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeModal() {
  const modal = document.getElementById('modal');
  const video = document.getElementById('video');
  video.pause();
  modal.classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

function uploadVideo() {
  const title = document.getElementById('title').value;
  const fileInput = document.getElementById('videoUpload');
  const formData = new FormData();

  formData.append('title', title);
  formData.append('video', fileInput.files[0]);

  const loader = document.getElementById('loader');
  loader.classList.remove('hidden'); // Show loader
  document.body.classList.add('no-scroll');
  const messageDiv = document.getElementById('message');

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Video uploaded and converted successfully.') {
        // loadTimeline();
        loader.classList.add('hidden'); // Hide loader
        document.body.classList.remove('no-scroll');
        alert('Video uploaded and converted successfully.');
        fileInput.value = null;
        loadVideos();
      } else {
        loader.classList.add('hidden');
        fileInput.value = null;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
