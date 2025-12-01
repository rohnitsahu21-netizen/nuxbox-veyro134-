// NuxBox - Static HTML/CSS/JS Version
// Uses localStorage for data persistence

// Sample Apps Data
const sampleApps = [
  {
    id: 1,
    name: 'VLC Media Player',
    description: 'Powerful and free media player for Linux. Play almost any video and audio files.',
    category: 'Multimedia',
    version: '3.0.20',
    fileName: 'vlc-3.0.20.zip',
    downloads: 1543,
    icon: '🎬'
  },
  {
    id: 2,
    name: 'GIMP',
    description: 'Free and open source image editor. Full featured raster graphics editor.',
    category: 'Graphics',
    version: '2.10.36',
    fileName: 'gimp-2.10.36.zip',
    downloads: 892,
    icon: '🎨'
  },
  {
    id: 3,
    name: 'Blender',
    description: '3D modeling, animation, rendering and compositing software.',
    category: 'Graphics',
    version: '4.1.1',
    fileName: 'blender-4.1.1.zip',
    downloads: 567,
    icon: '🎭'
  },
  {
    id: 4,
    name: 'LibreOffice',
    description: 'Free office suite with writer, calc, impress and draw applications.',
    category: 'Office',
    version: '7.6.3',
    fileName: 'libreoffice-7.6.3.zip',
    downloads: 734,
    icon: '📄'
  },
  {
    id: 5,
    name: 'Audacity',
    description: 'Free, open source audio editor and recorder for multi-track editing.',
    category: 'Multimedia',
    version: '3.4.1',
    fileName: 'audacity-3.4.1.zip',
    downloads: 456,
    icon: '🎵'
  },
  {
    id: 6,
    name: 'VS Code',
    description: 'Lightweight but powerful source code editor for Linux.',
    category: 'Development',
    version: '1.92.0',
    fileName: 'vscode-1.92.0.zip',
    downloads: 2134,
    icon: '💻'
  }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  loadAppsData();
  populateReportDropdowns();
  displayFeedback();
  displayReports();
});

// Page Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
  updateNavLinks(pageId);
  window.scrollTo(0, 0);
}

function showHome() {
  showPage('home');
}

function showBrowse() {
  showPage('browse');
  displayApps();
}

function showFeedback() {
  showPage('feedback');
}

function showReport() {
  showPage('report');
}

function showAppDetail(appId) {
  const app = sampleApps.find(a => a.id === appId);
  if (!app) return;

  const detailContent = `
    <div class="app-detail-info">
      <div style="font-size: 80px; text-align: center;">${app.icon}</div>
      <div>
        <p><strong>Version:</strong> ${app.version}</p>
        <p><strong>Category:</strong> ${app.category}</p>
        <p><strong>Downloads:</strong> ${app.downloads}</p>
        <p><strong>File:</strong> ${app.fileName}</p>
      </div>
    </div>
    <p>${app.description}</p>
    <button onclick="downloadApp(${app.id})" class="btn btn-primary download-btn">Download</button>
  `;

  document.getElementById('appDetailContent').innerHTML = `
    <h1>${app.name}</h1>
    ${detailContent}
  `;

  showPage('appDetail');
}

// Apps Functions
function loadAppsData() {
  // Check if apps are in localStorage, if not use sample data
  if (!localStorage.getItem('nuxboxApps')) {
    localStorage.setItem('nuxboxApps', JSON.stringify(sampleApps));
  }
}

function getApps() {
  const apps = localStorage.getItem('nuxboxApps');
  return apps ? JSON.parse(apps) : sampleApps;
}

function displayApps() {
  const apps = getApps();
  const appsList = document.getElementById('appsList');
  
  if (apps.length === 0) {
    appsList.innerHTML = '<p>No apps found. Try a different search.</p>';
    return;
  }

  appsList.innerHTML = apps.map(app => `
    <div class="app-card" onclick="showAppDetail(${app.id})">
      <div class="app-icon">${app.icon}</div>
      <h3>${app.name}</h3>
      <p>${app.description.substring(0, 100)}...</p>
      <div class="app-meta">
        <span>${app.category}</span>
        <span>v${app.version}</span>
        <span>📥 ${app.downloads}</span>
      </div>
    </div>
  `).join('');
}

function filterApps() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const categoryFilter = document.getElementById('categoryFilter').value;
  const apps = getApps();

  const filtered = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchInput) ||
                         app.description.toLowerCase().includes(searchInput);
    const matchesCategory = !categoryFilter || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const appsList = document.getElementById('appsList');
  if (filtered.length === 0) {
    appsList.innerHTML = '<p>No apps found.</p>';
    return;
  }

  appsList.innerHTML = filtered.map(app => `
    <div class="app-card" onclick="showAppDetail(${app.id})">
      <div class="app-icon">${app.icon}</div>
      <h3>${app.name}</h3>
      <p>${app.description.substring(0, 100)}...</p>
      <div class="app-meta">
        <span>${app.category}</span>
        <span>v${app.version}</span>
        <span>📥 ${app.downloads}</span>
      </div>
    </div>
  `).join('');
}

function downloadApp(appId) {
  const app = sampleApps.find(a => a.id === appId);
  if (!app) return;

  alert(`Download: ${app.name}\n\nFile: ${app.fileName}\n\nNote: In the full version, this would download the file from the server.`);

  // Increment download count
  const apps = getApps();
  const appIndex = apps.findIndex(a => a.id === appId);
  if (appIndex !== -1) {
    apps[appIndex].downloads++;
    localStorage.setItem('nuxboxApps', JSON.stringify(apps));
  }
}

// Feedback Functions
function submitFeedback(event) {
  event.preventDefault();

  const feedback = {
    id: Date.now(),
    name: document.getElementById('feedbackName').value,
    subject: document.getElementById('feedbackSubject').value,
    message: document.getElementById('feedbackMessage').value,
    rating: document.getElementById('feedbackRating').value || 'N/A',
    date: new Date().toLocaleDateString()
  };

  // Save to localStorage
  let feedbackList = JSON.parse(localStorage.getItem('nuxboxFeedback') || '[]');
  feedbackList.unshift(feedback);
  localStorage.setItem('nuxboxFeedback', JSON.stringify(feedbackList));

  // Reset form
  document.getElementById('feedbackForm').reset();
  alert('Thank you for your feedback!');
  displayFeedback();
}

function displayFeedback() {
  const feedbackList = JSON.parse(localStorage.getItem('nuxboxFeedback') || '[]');
  const container = document.getElementById('feedbackList');

  if (feedbackList.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No feedback yet.</p>';
    return;
  }

  container.innerHTML = feedbackList.map(fb => `
    <div class="feedback-item">
      <h4>${fb.subject}</h4>
      <p><strong>By:</strong> ${fb.name}</p>
      <p>${fb.message}</p>
      ${fb.rating !== 'N/A' ? `<p><strong>Rating:</strong> ${fb.rating}/5 ⭐</p>` : ''}
      <div class="feedback-time">${fb.date}</div>
    </div>
  `).join('');
}

// Report Functions
function populateReportDropdowns() {
  const apps = getApps();
  const select = document.getElementById('reportApp');
  select.innerHTML = '<option value="">Select an app...</option>' + 
    apps.map(app => `<option value="${app.id}">${app.name}</option>`).join('');
}

function submitReport(event) {
  event.preventDefault();

  const appId = document.getElementById('reportApp').value;
  const app = getApps().find(a => a.id == appId);

  const report = {
    id: Date.now(),
    name: document.getElementById('reportName').value,
    appName: app ? app.name : 'Unknown',
    issueType: document.getElementById('issueType').value,
    description: document.getElementById('reportDescription').value,
    status: 'Open',
    date: new Date().toLocaleDateString()
  };

  // Save to localStorage
  let reportList = JSON.parse(localStorage.getItem('nuxboxReports') || '[]');
  reportList.unshift(report);
  localStorage.setItem('nuxboxReports', JSON.stringify(reportList));

  // Reset form
  document.getElementById('reportForm').reset();
  alert('Thank you for reporting this issue!');
  displayReports();
}

function displayReports() {
  const reportList = JSON.parse(localStorage.getItem('nuxboxReports') || '[]');
  const container = document.getElementById('reportList');

  if (reportList.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No reports yet.</p>';
    return;
  }

  container.innerHTML = reportList.map(rep => `
    <div class="report-item">
      <h4>${rep.appName} - ${rep.issueType}</h4>
      <p><strong>By:</strong> ${rep.name}</p>
      <p>${rep.description}</p>
      <p><strong>Status:</strong> <span style="color: var(--accent);">${rep.status}</span></p>
      <div class="report-time">${rep.date}</div>
    </div>
  `).join('');
}

// Initialize on load
function updateNavLinks(pageId) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const linkMap = {
    'home': 0,
    'browse': 1,
    'feedback': 2,
    'report': 3
  };
  
  if (linkMap[pageId] !== undefined) {
    document.querySelectorAll('.nav-link')[linkMap[pageId]].classList.add('active');
  }
}
