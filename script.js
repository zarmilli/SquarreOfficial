document.getElementById('getStartedBtn').addEventListener('click', () => {
  const section = document.querySelector('#about');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

document.getElementById('download-btn').addEventListener('click', () => {
  window.location.href = 'download.html';
});
