/**
 * Blue Dale Construction - Admin Controller
 */

// --- Mock Database for Demo Mode ---
const MOCK_DATA = {
  about: {
    story: "Founded over a decade ago, Blue Dale Construction began with a simple vision: to design and build structures that offer both structural safety and elegant architectural beauty. Today, we are proud to be recognized as one of the leading construction agencies, catering to both residential homeowners and corporate developers.",
    experience: 12,
    projectsCompleted: 250,
    email: "shakthiarasu@gmail.com",
    phone: "+91 88380 37125",
    whatsapp: "919345827074",
    instagram: "https://www.instagram.com/bluedaleconstructions?igsh=bmR3aHUxeHY4am5m",
    address: "Blue Dale Constructions, No-4 Telugu Bramana Street, Gandhipark, Coimbatore - 641001, Tamil Nadu, India",
    hours: "Monday - Saturday: 9:00 AM - 6:00 PM"
  },
  services: [
    {
      id: "srv1",
      title: "Residential Build",
      icon: "fa-home",
      description: "Creating spectacular custom homes, luxury villas, and contemporary apartments tailored specifically to modern lifestyles.",
      features: "Custom Luxury Villas & Bungalows\nHigh-Rise Apartment Blocks\nEco-Friendly Smart Residences\nDuplex & Multi-Family Houses"
    },
    {
      id: "srv2",
      title: "Commercial Dev",
      icon: "fa-building",
      description: "Constructing sleek, efficient business hubs, retail malls, showrooms, and industrial structures with cutting-edge tech.",
      features: "State-of-the-Art Office Parks\nRetail Outlets & Showrooms\nHigh-End Restaurants & Hotels\nStructural Steel Complexes"
    },
    {
      id: "srv3",
      title: "Renovations",
      icon: "fa-tools",
      description: "Transforming outdated structures with modern retrofitting, structural repairs, high-end finishing, and spatial updates.",
      features: "Modern Kitchen & Bath Remodels\nStructural Retrofitting & Repairs\nCommercial Office Redesigns\nExterior Facade Upgrades"
    },
    {
      id: "srv4",
      title: "Architectural Design",
      icon: "fa-pencil-ruler",
      description: "Every successful construction begins with a well-planned blueprint. We provide high-precision 2D drafts, 3D renders, and zoning layout planning.",
      features: "3D Elevation & Walkthrough Renders\nMunicipal Approvals & Permits\nStructural Engineering Blueprints\nBudget Estimation & Cost Sheets"
    }
  ],
  works: [
    {
      id: "work1",
      name: "The Horizon Villa",
      year: 2024,
      category: "residential",
      location: "Green Valley Suburbs",
      description: "A premium double-story custom residential villa built with modern glass facades and wooden panel cladding. Features a luxury swimming pool, custom layout, and modular interior fittings.",
      imageUrl: "../work_villa.png"
    },
    {
      id: "work2",
      name: "Apex Business Hub",
      year: 2023,
      category: "commercial",
      location: "Tech Park Central",
      description: "A modern state-of-the-art office corporate complex featuring sleek structural glass curtain walls, steel framings, landscaped gardens, and a clean concrete public plaza.",
      imageUrl: "../work_commercial.png"
    },
    {
      id: "work3",
      name: "Skyline Residency",
      year: 2025,
      category: "residential",
      location: "North Ridge Blvd",
      description: "A luxury mid-rise apartment complex. Features private botanical balconies, architectural lighting, concrete-wood elements, and modular utility shafts.",
      imageUrl: "../work_apartment.png"
    },
    {
      id: "work4",
      name: "Maple Wood Estate",
      year: 2024,
      category: "renovations",
      location: "Maple Wood Suburbs",
      description: "Complete exterior and interior makeover of a suburban family residence. Updated structural frames, installed high-grade cladding, and optimized kitchen energy systems.",
      imageUrl: "../work_residence.png"
    }
  ],
  inquiries: [
    {
      id: "inq1",
      name: "Aman Gupta",
      email: "aman@example.com",
      phone: "+91 98765 43210",
      projectType: "residential",
      budget: "high",
      details: "Looking to build a 3BHK duplex villa in Coimbatore. Seeking architectural blueprinting and structural build services.",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
    }
  ]
};

// Initialize Mock database if empty in localStorage
function initMockData() {
  if (!localStorage.getItem('bd_about')) localStorage.setItem('bd_about', JSON.stringify(MOCK_DATA.about));
  if (!localStorage.getItem('bd_services')) localStorage.setItem('bd_services', JSON.stringify(MOCK_DATA.services));
  if (!localStorage.getItem('bd_works')) localStorage.setItem('bd_works', JSON.stringify(MOCK_DATA.works));
  if (!localStorage.getItem('bd_inquiries')) localStorage.setItem('bd_inquiries', JSON.stringify(MOCK_DATA.inquiries));
}

if (window.isFirebaseDemo) {
  initMockData();
}

// Global Variables
let currentActivePanel = "overview";

// --- Document Ready Handler ---
document.addEventListener('DOMContentLoaded', () => {
  setupPanelSwitcher();
  setupAuthListeners();
  
  if (window.isFirebaseDemo) {
    document.getElementById('demoBanner').style.display = 'flex';
    loadDashboardData();
  } else {
    document.getElementById('demoBanner').style.display = 'none';
  }
});

// --- Authentication Controllers ---
function setupAuthListeners() {
  const loginForm = document.getElementById('adminLoginForm');
  const signupForm = document.getElementById('adminSignupForm');
  const loginOverlay = document.getElementById('loginOverlay');
  const errorMsg = document.getElementById('loginErrorMessage');
  const logoutBtn = document.getElementById('logoutBtn');
  const toggleAuthModeBtn = document.getElementById('toggleAuthMode');
  const authTitle = document.getElementById('authTitle');
  const authSwitchText = document.getElementById('authSwitchText');

  const showAuthError = (message) => {
    errorMsg.innerText = message;
    errorMsg.style.display = 'block';
  };

  const clearAuthError = () => {
    errorMsg.innerText = '';
    errorMsg.style.display = 'none';
  };

  const setAuthMode = (mode) => {
    clearAuthError();
    const isSignup = mode === 'signup';
    loginForm.style.display = isSignup ? 'none' : 'block';
    signupForm.style.display = isSignup ? 'block' : 'none';
    authTitle.innerText = isSignup ? 'Create Admin Account' : 'Admin Login';
    authSwitchText.innerText = isSignup ? 'Already have an account?' : 'No admin account?';
    toggleAuthModeBtn.innerText = isSignup ? 'Login' : 'Create one';
  };

  if (toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener('click', () => {
      const isSignupOpen = signupForm.style.display !== 'none';
      setAuthMode(isSignupOpen ? 'login' : 'signup');
    });
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginId = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPassword').value;
      clearAuthError();

      if (window.isFirebaseDemo) {
        // In demo mode, accept anything
        sessionStorage.setItem('bd_admin_auth', 'true');
        loginOverlay.style.display = 'none';
        showToast("Logged in as Demo Admin!");
        loadDashboardData();
      } else {
        // Use Firebase Auth
        try {
          const email = await resolveLoginEmail(loginId);
          await window.auth.signInWithEmailAndPassword(email, pass);
          loginOverlay.style.display = 'none';
          showToast("Authenticated successfully!");
          loadDashboardData();
        } catch (error) {
          showAuthError(error.message);
        }
      }
    });
  }

  // Handle Account Creation Submit
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthError();

      const username = normalizeUsername(document.getElementById('signupUsername').value);
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const pass = document.getElementById('signupPassword').value;

      if (!username) {
        showAuthError('Please enter a username using letters, numbers, dot, dash, or underscore.');
        return;
      }

      if (window.isFirebaseDemo) {
        sessionStorage.setItem('bd_admin_auth', 'true');
        loginOverlay.style.display = 'none';
        showToast("Demo admin account created!");
        loadDashboardData();
        return;
      }

      try {
        const setupRef = window.db.collection('settings').doc('adminSetup');
        const setupDoc = await setupRef.get();
        if (setupDoc.exists) {
          showAuthError('Admin setup is already complete. Please login with an existing account.');
          return;
        }

        const usernameRef = window.db.collection('usernames').doc(username);
        const usernameDoc = await usernameRef.get();
        if (usernameDoc.exists) {
          showAuthError('That username is already taken.');
          return;
        }

        const cred = await window.auth.createUserWithEmailAndPassword(email, pass);
        const profile = {
          uid: cred.user.uid,
          username,
          email,
          role: 'admin',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const batch = window.db.batch();
        batch.set(window.db.collection('admins').doc(cred.user.uid), profile);
        batch.set(usernameRef, {
          uid: cred.user.uid,
          username,
          email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.set(setupRef, {
          firstAdminUid: cred.user.uid,
          firstAdminUsername: username,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        await batch.commit();

        loginOverlay.style.display = 'none';
        showToast("Admin account created!");
        loadDashboardData();
      } catch (error) {
        showAuthError(error.message);
      }
    });
  }

  // Handle Logout Click
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (window.isFirebaseDemo) {
        sessionStorage.removeItem('bd_admin_auth');
        loginOverlay.style.display = 'flex';
        showToast("Logged out!");
      } else {
        window.auth.signOut().then(() => {
          loginOverlay.style.display = 'flex';
          showToast("Logged out successfully!");
        });
      }
    });
  }

  // Check login state on load
  if (window.isFirebaseDemo) {
    if (sessionStorage.getItem('bd_admin_auth') === 'true') {
      loginOverlay.style.display = 'none';
    } else {
      loginOverlay.style.display = 'flex';
    }
  } else {
    // Listen to Firebase auth changes
    window.auth.onAuthStateChanged(user => {
      if (user) {
        loginOverlay.style.display = 'none';
        loadDashboardData();
      } else {
        loginOverlay.style.display = 'flex';
      }
    });
  }
}

function normalizeUsername(value) {
  const cleaned = (value || '').trim().toLowerCase();
  return /^[a-z0-9._-]{3,30}$/.test(cleaned) ? cleaned : '';
}

async function resolveLoginEmail(loginId) {
  const value = (loginId || '').trim().toLowerCase();
  if (!value) throw new Error('Please enter your username or email.');
  if (value.includes('@')) return value;

  const username = normalizeUsername(value);
  if (!username) throw new Error('Invalid username format.');

  const doc = await window.db.collection('usernames').doc(username).get();
  if (!doc.exists || !doc.data().email) {
    throw new Error('No admin account found for that username.');
  }
  return doc.data().email;
}

// --- Navigation Tabs Switcher ---
function setupPanelSwitcher() {
  const menuItems = document.querySelectorAll('.sidebar-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const panelId = item.getAttribute('data-panel');
      switchPanel(panelId);
    });
  });
}

function switchPanel(panelId) {
  // Hide all panels
  const panels = document.querySelectorAll('.admin-panel');
  panels.forEach(p => p.classList.remove('active'));
  
  // Show active panel
  const activePanel = document.getElementById(`panel-${panelId}`);
  if (activePanel) {
    activePanel.classList.add('active');
    currentActivePanel = panelId;
    
    // Update headers
    const titles = {
      overview: "Overview Dashboard",
      about: "Edit About Page",
      services: "Manage Services",
      works: "Works Portfolio",
      inquiries: "User Inquiries"
    };
    const subtitles = {
      overview: "Metrics and quick links",
      about: "Edit company description, hours, and contact channels",
      services: "Add, modify, or remove construction service offerings",
      works: "Upload completed site profiles, years, and descriptions",
      inquiries: "Review inquiries submitted via your contact page"
    };
    
    document.getElementById('panelTitle').innerText = titles[panelId];
    document.getElementById('panelSubtitle').innerText = subtitles[panelId];
    
    // Sync tab highlighting in sidebar
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(it => {
      if (it.getAttribute('data-panel') === panelId) {
        it.classList.add('active');
      } else {
        it.classList.remove('active');
      }
    });

    // Refresh panel specific lists
    if (panelId === 'about') loadAboutEditor();
    if (panelId === 'services') loadServicesTable();
    if (panelId === 'works') loadWorksTable();
    if (panelId === 'inquiries') loadInquiriesTable();
  }
}

// Bind switchPanel to window scope for quick links
window.switchPanel = switchPanel;


// --- Data Loaders & CMS Managers ---

function loadDashboardData() {
  if (window.isFirebaseDemo) {
    const services = JSON.parse(localStorage.getItem('bd_services'));
    const works = JSON.parse(localStorage.getItem('bd_works'));
    const inquiries = JSON.parse(localStorage.getItem('bd_inquiries'));
    const about = JSON.parse(localStorage.getItem('bd_about'));
    
    document.getElementById('mServices').innerText = services.length;
    document.getElementById('mProjects').innerText = works.length;
    document.getElementById('mInquiries').innerText = inquiries.length;
    document.getElementById('mYears').innerText = about.experience || 12;

    const unreadCount = inquiries.length;
    const badge = document.getElementById('inquiryCountBadge');
    if (unreadCount > 0) {
      badge.innerText = unreadCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  } else {
    // Read live from Firebase Firestore
    window.db.collection('services').get().then(snap => {
      document.getElementById('mServices').innerText = snap.size;
    });
    window.db.collection('works').get().then(snap => {
      document.getElementById('mProjects').innerText = snap.size;
    });
    window.db.collection('inquiries').get().then(snap => {
      document.getElementById('mInquiries').innerText = snap.size;
      const badge = document.getElementById('inquiryCountBadge');
      if (snap.size > 0) {
        badge.innerText = snap.size;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    });
    window.db.collection('settings').doc('about').get().then(doc => {
      if (doc.exists) {
        document.getElementById('mYears').innerText = doc.data().experience || 12;
      }
    });
  }
}

// --- 1. About Page Editor ---
function loadAboutEditor() {
  const form = document.getElementById('aboutEditorForm');
  
  if (window.isFirebaseDemo) {
    const about = JSON.parse(localStorage.getItem('bd_about'));
    populateAboutFields(about);
  } else {
    window.db.collection('settings').doc('about').get().then(doc => {
      if (doc.exists) {
        populateAboutFields(doc.data());
      }
    });
  }

  // Handle about form submission
  form.onsubmit = (e) => {
    e.preventDefault();
    const data = {
      story: document.getElementById('aboutStory').value,
      experience: parseInt(document.getElementById('aboutExperience').value, 10),
      projectsCompleted: parseInt(document.getElementById('aboutProjectsCompleted').value, 10),
      email: document.getElementById('contactEmail').value,
      phone: document.getElementById('contactPhone').value,
      whatsapp: document.getElementById('contactWhatsapp').value,
      instagram: document.getElementById('contactInstagram').value,
      address: document.getElementById('contactAddress').value,
      hours: document.getElementById('contactHours').value
    };

    if (window.isFirebaseDemo) {
      localStorage.setItem('bd_about', JSON.stringify(data));
      showToast("About content updated locally!");
      loadDashboardData();
    } else {
      window.db.collection('settings').doc('about').set(data)
        .then(() => {
          showToast("About page updated in Firebase!");
          loadDashboardData();
        })
        .catch(err => alert("Error saving: " + err.message));
    }
  };
}

function populateAboutFields(data) {
  if (!data) return;
  document.getElementById('aboutStory').value = data.story || '';
  document.getElementById('aboutExperience').value = data.experience || 12;
  document.getElementById('aboutProjectsCompleted').value = data.projectsCompleted || 250;
  document.getElementById('contactEmail').value = data.email || '';
  document.getElementById('contactPhone').value = data.phone || '';
  document.getElementById('contactWhatsapp').value = data.whatsapp || '';
  document.getElementById('contactInstagram').value = data.instagram || '';
  document.getElementById('contactAddress').value = data.address || '';
  document.getElementById('contactHours').value = data.hours || '';
}


// --- 2. Services Management ---
function loadServicesTable() {
  const tbody = document.querySelector('#servicesTable tbody');
  tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading services...</td></tr>';

  const render = (services) => {
    tbody.innerHTML = '';
    if (services.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No services found. Click Add to create one.</td></tr>';
      return;
    }
    services.forEach(srv => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><i class="fas ${srv.icon}" style="font-size: 1.5rem; color: var(--accent);"></i></td>
        <td><strong>${srv.title}</strong></td>
        <td style="color: var(--text-muted); max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${srv.description}</td>
        <td>
          <div class="cell-actions">
            <button class="action-btn action-edit" onclick="editService('${srv.id}')"><i class="fas fa-edit"></i></button>
            <button class="action-btn action-delete" onclick="deleteService('${srv.id}')"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  if (window.isFirebaseDemo) {
    const services = JSON.parse(localStorage.getItem('bd_services')) || [];
    render(services);
  } else {
    window.db.collection('services').get().then(snap => {
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      render(list);
    });
  }
}

// Setup service forms
document.getElementById('btnAddService').onclick = () => {
  document.getElementById('serviceForm').reset();
  document.getElementById('serviceEditId').value = '';
  document.getElementById('serviceModalTitle').innerText = 'Add New Service';
  openModal('serviceModal');
};

document.getElementById('serviceForm').onsubmit = (e) => {
  e.preventDefault();
  const id = document.getElementById('serviceEditId').value;
  const srvData = {
    title: document.getElementById('serviceTitle').value,
    icon: document.getElementById('serviceIcon').value,
    description: document.getElementById('serviceDesc').value,
    features: document.getElementById('serviceFeatures').value
  };

  if (window.isFirebaseDemo) {
    let services = JSON.parse(localStorage.getItem('bd_services')) || [];
    if (id) {
      // Update
      services = services.map(s => s.id === id ? { ...s, ...srvData } : s);
    } else {
      // Add
      srvData.id = "srv_" + Date.now();
      services.push(srvData);
    }
    localStorage.setItem('bd_services', JSON.stringify(services));
    closeModal('serviceModal');
    showToast("Service saved locally!");
    loadServicesTable();
    loadDashboardData();
  } else {
    // Save to Firestore
    const ref = id ? window.db.collection('services').doc(id) : window.db.collection('services').doc();
    ref.set(srvData)
      .then(() => {
        closeModal('serviceModal');
        showToast("Service saved in Firebase!");
        loadServicesTable();
        loadDashboardData();
      })
      .catch(err => alert("Error saving: " + err.message));
  }
};

window.editService = (id) => {
  const populate = (srv) => {
    document.getElementById('serviceEditId').value = srv.id || id;
    document.getElementById('serviceTitle').value = srv.title;
    document.getElementById('serviceIcon').value = srv.icon;
    document.getElementById('serviceDesc').value = srv.description;
    document.getElementById('serviceFeatures').value = srv.features;
    document.getElementById('serviceModalTitle').innerText = 'Edit Service';
    openModal('serviceModal');
  };

  if (window.isFirebaseDemo) {
    const services = JSON.parse(localStorage.getItem('bd_services')) || [];
    const srv = services.find(s => s.id === id);
    if (srv) populate(srv);
  } else {
    window.db.collection('services').doc(id).get().then(doc => {
      if (doc.exists) populate(doc.data());
    });
  }
};

window.deleteService = (id) => {
  if (!confirm("Are you sure you want to delete this service?")) return;

  if (window.isFirebaseDemo) {
    let services = JSON.parse(localStorage.getItem('bd_services')) || [];
    services = services.filter(s => s.id !== id);
    localStorage.setItem('bd_services', JSON.stringify(services));
    showToast("Service deleted locally.");
    loadServicesTable();
    loadDashboardData();
  } else {
    window.db.collection('services').doc(id).delete().then(() => {
      showToast("Service removed from Firebase.");
      loadServicesTable();
      loadDashboardData();
    });
  }
};


// --- 3. Works Management ---
function loadWorksTable() {
  const tbody = document.querySelector('#worksTable tbody');
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading project works...</td></tr>';

  const render = (works) => {
    tbody.innerHTML = '';
    if (works.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No portfolio works found. Click Add to create one.</td></tr>';
      return;
    }
    works.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${w.imageUrl || '../work_villa.png'}" style="height: 50px; width: 70px; object-fit: cover; border-radius: 4px; border: 1px solid #e2e8f0;"></td>
        <td><strong>${w.name}</strong></td>
        <td>${w.year}</td>
        <td>${w.location}</td>
        <td><span style="font-size: 0.8rem; background-color: var(--primary-light); color: var(--text-light); padding: 4px 8px; border-radius: 10px; text-transform: uppercase;">${w.category}</span></td>
        <td>
          <div class="cell-actions">
            <button class="action-btn action-edit" onclick="editWork('${w.id}')"><i class="fas fa-edit"></i></button>
            <button class="action-btn action-delete" onclick="deleteWork('${w.id}')"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  if (window.isFirebaseDemo) {
    const works = JSON.parse(localStorage.getItem('bd_works')) || [];
    render(works);
  } else {
    window.db.collection('works').get().then(snap => {
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      render(list);
    });
  }
}

// Track current image for editing (keeps old image if no new file picked)
let currentEditImageUrl = '';

// Setup project forms
document.getElementById('btnAddWork').onclick = () => {
  document.getElementById('workForm').reset();
  document.getElementById('workEditId').value = '';
  document.getElementById('workModalTitle').innerText = 'Add Project Work Profile';
  document.getElementById('workImageUrl').value = '';
  currentEditImageUrl = ''; // clear stored image
  // Reset preview
  document.getElementById('imagePreviewWrapper').style.display = 'none';
  document.getElementById('imagePreview').src = '';
  document.getElementById('uploadZone').style.display = 'none';
  openModal('workModal');
};

document.getElementById('workForm').onsubmit = (e) => {
  e.preventDefault();
  const id = document.getElementById('workEditId').value;
  const submitBtn = document.getElementById('btnSaveWork');
  const resetSaveButton = () => {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Save Project';
  };
  
  const workData = {
    name: document.getElementById('workName').value,
    year: parseInt(document.getElementById('workYear').value, 10),
    category: document.getElementById('workCategory').value,
    location: document.getElementById('workLocation').value,
    description: document.getElementById('workDesc').value,
    imageUrl: document.getElementById('workImageUrl').value.trim() || currentEditImageUrl
  };

  const fileInput = document.getElementById('workImageFile');
  const file = null;
  workData.imageUrl = workData.imageUrl || '../work_villa.png';

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  // Handler to write record once image is resolved
  const saveRecord = (finalImageUrl) => {
    workData.imageUrl = finalImageUrl;
    
    if (window.isFirebaseDemo) {
      let works = JSON.parse(localStorage.getItem('bd_works')) || [];
      if (id) {
        works = works.map(w => w.id === id ? { ...w, ...workData } : w);
      } else {
        workData.id = "work_" + Date.now();
        works.push(workData);
      }
      localStorage.setItem('bd_works', JSON.stringify(works));
      resetSaveButton();
      closeModal('workModal');
      showToast('Project saved locally!');
      loadWorksTable();
      loadDashboardData();
    } else {
      const ref = id
        ? window.db.collection('works').doc(id)
        : window.db.collection('works').doc();
      ref.set(workData)
        .then(() => {
          resetSaveButton();
          closeModal('workModal');
          showToast('Project saved in Firebase!');
          loadWorksTable();
          loadDashboardData();
        })
        .catch(err => {
          resetSaveButton();
          alert('Error: ' + err.message);
        });
    }
  };

  if (file) {
    // New file selected — upload it
    if (window.isFirebaseDemo) {
      // Demo mode: convert to base64 so it persists in localStorage
      const reader = new FileReader();
      reader.onload = (ev) => saveRecord(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      resetSaveButton();
      alert('File upload is disabled for the free plan. Paste an image URL/path instead.');
    }
  } else {
    // No new file — save URL/path or keep existing image.
    saveRecord(workData.imageUrl);
  }
};

window.editWork = (id) => {
  const populate = (w) => {
    document.getElementById('workEditId').value = w.id || id;
    document.getElementById('workName').value = w.name;
    document.getElementById('workYear').value = w.year;
    document.getElementById('workCategory').value = w.category;
    document.getElementById('workLocation').value = w.location;
    document.getElementById('workDesc').value = w.description;
    document.getElementById('workImageUrl').value = w.imageUrl || '';
    document.getElementById('workModalTitle').innerText = 'Edit Project Details';

    // Store existing image and show preview
    currentEditImageUrl = w.imageUrl || '';
    if (currentEditImageUrl) {
      document.getElementById('imagePreview').src = currentEditImageUrl;
      document.getElementById('imagePreviewWrapper').style.display = 'block';
      document.getElementById('uploadZone').style.display = 'none';
    } else {
      document.getElementById('imagePreviewWrapper').style.display = 'none';
      document.getElementById('uploadZone').style.display = 'none';
    }
    // Reset file input so no stale file remains
    document.getElementById('workImageFile').value = '';

    openModal('workModal');
  };

  if (window.isFirebaseDemo) {
    const works = JSON.parse(localStorage.getItem('bd_works')) || [];
    const w = works.find(item => item.id === id);
    if (w) populate(w);
  } else {
    window.db.collection('works').doc(id).get().then(doc => {
      if (doc.exists) populate({ id: doc.id, ...doc.data() });
    });
  }
};

// Remove selected image and show the upload zone again
window.removeSelectedImage = () => {
  currentEditImageUrl = '';
  document.getElementById('workImageFile').value = '';
  document.getElementById('imagePreview').src = '';
  document.getElementById('imagePreviewWrapper').style.display = 'none';
  document.getElementById('uploadZone').style.display = 'block';
};

window.deleteWork = (id) => {
  if (!confirm("Are you sure you want to delete this project work?")) return;

  if (window.isFirebaseDemo) {
    let works = JSON.parse(localStorage.getItem('bd_works')) || [];
    works = works.filter(w => w.id !== id);
    localStorage.setItem('bd_works', JSON.stringify(works));
    showToast("Project deleted locally.");
    loadWorksTable();
    loadDashboardData();
  } else {
    window.db.collection('works').doc(id).delete().then(() => {
      showToast("Project deleted from Firebase.");
      loadWorksTable();
      loadDashboardData();
    });
  }
};


// --- 4. User Inquiries Viewer ---
function loadInquiriesTable() {
  const tbody = document.querySelector('#inquiriesTable tbody');
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading inquiries...</td></tr>';

  const render = (list) => {
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No customer inquiries received yet.</td></tr>';
      return;
    }
    
    // Sort descending by date
    list.sort((a, b) => toDateValue(b.timestamp) - toDateValue(a.timestamp));

    list.forEach(inq => {
      const dateStr = toDateValue(inq.timestamp).toLocaleString();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">${dateStr}</td>
        <td>
          <strong>${inq.name}</strong><br>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${inq.email}</span><br>
          <span style="font-size: 0.85rem; font-weight: 600;">${inq.phone}</span>
        </td>
        <td><span style="font-size: 0.8rem; background-color: var(--accent-light); color: var(--accent-hover); padding: 4px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase;">${inq.projectType}</span></td>
        <td><span style="font-weight: 600;">${inq.budget}</span></td>
        <td style="font-size: 0.85rem; max-width: 300px; word-break: break-word;">${inq.details}</td>
        <td>
          <button class="action-btn action-delete" onclick="deleteInquiry('${inq.id}')"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  if (window.isFirebaseDemo) {
    const inquiries = JSON.parse(localStorage.getItem('bd_inquiries')) || [];
    render(inquiries);
  } else {
    window.db.collection('inquiries').get().then(snap => {
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      render(list);
    });
  }
}

window.deleteInquiry = (id) => {
  if (!confirm("Delete this inquiry log permanently?")) return;

  if (window.isFirebaseDemo) {
    let inquiries = JSON.parse(localStorage.getItem('bd_inquiries')) || [];
    inquiries = inquiries.filter(i => i.id !== id);
    localStorage.setItem('bd_inquiries', JSON.stringify(inquiries));
    showToast("Inquiry deleted locally.");
    loadInquiriesTable();
    loadDashboardData();
  } else {
    window.db.collection('inquiries').doc(id).delete().then(() => {
      showToast("Inquiry deleted from Firebase.");
      loadInquiriesTable();
      loadDashboardData();
    });
  }
};

document.getElementById('btnClearInquiries').onclick = () => {
  if (!confirm("Are you sure you want to CLEAR ALL inquiry logs? This cannot be undone!")) return;

  if (window.isFirebaseDemo) {
    localStorage.setItem('bd_inquiries', JSON.stringify([]));
    showToast("All inquiries cleared.");
    loadInquiriesTable();
    loadDashboardData();
  } else {
    // Delete in batch
    window.db.collection('inquiries').get().then(snap => {
      const batch = window.db.batch();
      snap.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    }).then(() => {
      showToast("All database inquiries cleared.");
      loadInquiriesTable();
      loadDashboardData();
    });
  }
};


// --- Modal Helper Functions ---
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Bind closeModal to window scope
window.closeModal = closeModal;


// --- Helper Toast Notification ---
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMessage');
  msgEl.innerText = message;
  
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function toDateValue(value) {
  if (!value) return new Date(0);
  if (typeof value.toDate === 'function') return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
}

function withTimeout(promise, timeoutMs, message) {
  let timer;
  const timeout = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}


// --- File Upload: Preview & Drag-Drop ---
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('workImageFile');
  const uploadZone = document.getElementById('uploadZone');
  const previewWrapper = document.getElementById('imagePreviewWrapper');
  const previewImg = document.getElementById('imagePreview');

  if (!fileInput) return;

  // When user picks a file via the file picker
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) showImagePreview(file);
  });

  // Drag over — highlight the zone
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  // Drag leave — remove highlight
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  // Drop file onto the zone
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Assign dropped file to the input
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      showImagePreview(file);
    } else {
      alert('Please drop a valid image file (JPG, PNG, WEBP).');
    }
  });

  // Show preview helper
  function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImg.src = ev.target.result;
      currentEditImageUrl = ''; // will be set on save
      previewWrapper.style.display = 'block';
      uploadZone.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});
