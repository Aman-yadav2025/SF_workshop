// --- Data Structure ---
const topics = [
    { id: 'confessions', name: 'KGP Whispers', icon: 'fa-bullhorn', desc: 'Share your thoughts anonymously' },
    { id: 'cricket', name: 'Cricket', icon: 'fa-baseball-bat-ball', desc: 'Discuss matches, teams, and stats' },
    { id: 'football', name: 'Football', icon: 'fa-futbol', desc: 'EPL, La Liga, and campus tournaments' },
    { id: 'coding', name: 'Coding', icon: 'fa-code', desc: 'Development, projects, and tech stacks' },
    { id: 'dsa', name: 'DSA & CP', icon: 'fa-laptop-code', desc: 'Algorithms, LeetCode, and contests' },
    { id: 'placements', name: 'Placements', icon: 'fa-briefcase', desc: 'Interview experiences and prep' },
    { id: 'events', name: 'Campus Events', icon: 'fa-calendar-days', desc: 'Fests, workshops, and seminars' },
    { id: 'music', name: 'Music', icon: 'fa-music', desc: 'Jam sessions and song recommendations' }
];

let notesData = {};
topics.forEach(t => notesData[t.id] = []);

// Current State
let currentTopicId = null;
let currentUser = null; 
let selectedMedia = null;

const cardTints = [
    'var(--card-tint-1)', 'var(--card-tint-2)', 'var(--card-tint-3)', 
    'var(--card-tint-4)', 'var(--card-tint-5)'
];

// --- DOM Elements ---
const authOverlay = document.getElementById('auth-overlay');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const interestsGrid = document.getElementById('interests-grid');

const studentNameInput = document.getElementById('student-name');
const studentUsernameInput = document.getElementById('student-username');
const studentContactInput = document.getElementById('student-contact');
const studentPfpInput = document.getElementById('student-pfp');

const btnLogout = document.getElementById('btn-logout');
const btnThemeToggle = document.getElementById('btn-theme-toggle');

// Sidebar User Profile
const sidebarProfile = document.getElementById('sidebar-profile');
const displayUserName = document.getElementById('display-user-name');
const userAvatar = document.getElementById('user-avatar');

// Views
const feedView = document.getElementById('feed-view');
const profileView = document.getElementById('profile-view');
const btnBackFeed = document.getElementById('btn-back-feed');

// Profile Page Elements
const profilePageAvatar = document.getElementById('profile-page-avatar');
const profilePageName = document.getElementById('profile-page-name');
const profilePageUsername = document.getElementById('profile-page-username');
const profilePageContact = document.getElementById('profile-page-contact');
const profilePageInterests = document.getElementById('profile-page-interests');
const myNotesGrid = document.getElementById('my-notes-grid');

// Edit Profile Elements
const btnEditProfile = document.getElementById('btn-edit-profile');
const editProfileOverlay = document.getElementById('edit-profile-overlay');
const editProfileForm = document.getElementById('edit-profile-form');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const editNameInput = document.getElementById('edit-name');
const editUsernameInput = document.getElementById('edit-username');
const editContactInput = document.getElementById('edit-contact');
const editPfpInput = document.getElementById('edit-pfp');
const editInterestsGrid = document.getElementById('edit-interests-grid');

// Modals & Toasts
const logoutOverlay = document.getElementById('logout-overlay');
const btnCancelLogout = document.getElementById('btn-cancel-logout');
const btnConfirmLogout = document.getElementById('btn-confirm-logout');
const toastContainer = document.getElementById('toast-container');

// Feed Elements
const topicNav = document.getElementById('topic-nav');
const currentTopicTitle = document.getElementById('current-topic-title');
const currentTopicDesc = document.getElementById('current-topic-desc');
const noteCount = document.getElementById('note-count');
const notesGrid = document.getElementById('notes-grid');
const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const charCount = document.getElementById('char-count');
const anonCheckbox = document.getElementById('anon-checkbox');
const mediaUpload = document.getElementById('media-upload');
const mediaPreviewContainer = document.getElementById('media-preview-container');
const mediaPreviewContent = document.getElementById('media-preview-content');
const btnRemoveMedia = document.getElementById('btn-remove-media');

// --- Mock Data Generator ---
function generateMockData() {
    const mockNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Jamie"];
    const phrases = {
        'confessions': ["I honestly have no idea what's going on in OS.", "I accidentally called the professor 'Mom' today.", "The library coffee is water.", "Who took my umbrella from the CS lab?", "I think I'm falling for my lab partner."],
        'cricket': ["Did you see that ridiculous catch today?", "Kohli's cover drive is poetry.", "Our hostel team needs a fast bowler for the weekend.", "IPL auction predictions?", "Test cricket is real cricket."],
        'football': ["Messi vs Ronaldo debate is over.", "Who wants to play turf football at 7 PM?", "That VAR decision was an absolute joke.", "Looking for a goalkeeper for the intra-college cup.", "Champions League night!"],
        'coding': ["Just started learning React, it's awesome.", "Vim or VSCode? Fight.", "My code works but I don't know why.", "Looking for a hackathon team.", "CSS centering is still a nightmare."],
        'dsa': ["Just solved my first LeetCode Hard!", "Why is Dynamic Programming so confusing?", "Can someone explain segment trees?", "Got TLE on the 3rd question in the contest.", "Graph algorithms are my new favorite."],
        'placements': ["How to prepare for the Amazon OA?", "Got placed today! Thanks to everyone who helped.", "Any tips for HR rounds?", "My resume got shortlisted for the startup.", "Off-campus hunting is tough right now."],
        'events': ["Who is the guest artist for the cultural fest?", "Registrations for the coding bootcamp close tomorrow.", "Selling one ticket for the EDM night.", "The debate competition was intense.", "Food stalls this year are amazing."],
        'music': ["Anyone play bass? We need one for our band.", "Just discovered a sick indie rock band.", "Lo-fi hip hop to study/relax to is carrying my GPA.", "Who's going to the concert this weekend?", "Drop your best study playlists."]
    };

    let globalId = 1;
    topics.forEach(topic => {
        const sentences = phrases[topic.id];
        for (let i = 0; i < 50; i++) {
            const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
            const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
            const randomTimeOffset = Math.floor(Math.random() * 10000000000); // random time in the past
            
            notesData[topic.id].push({
                id: globalId++,
                text: `${randomSentence} #${topic.name.replace(/\s+/g, '')}`,
                timestamp: new Date(Date.now() - randomTimeOffset).toISOString(),
                author: randomName,
                avatar: randomName.substring(0, 2).toUpperCase(),
                media: null
            });
        }
        // Sort newest first
        notesData[topic.id].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });
}

// --- Initialization ---
function init() {
    generateMockData();
    setupTheme();
    // setupInteractiveBackground(); -> replaced by setupBlobBackground();
    setupBlobBackground();
    renderInterestsForm();
    checkAuth();
    setupAuthListeners();
}

function startApp() {
    // Populate user info in sidebar
    displayUserName.textContent = currentUser.name;
    if (currentUser.pfp) {
        userAvatar.style.backgroundImage = `url(${currentUser.pfp})`;
        userAvatar.textContent = '';
    } else {
        userAvatar.textContent = currentUser.initials;
    }
    
    // First topic in their interests, or default to first topic overall
    if (currentUser.interests && currentUser.interests.length > 0) {
        currentTopicId = currentUser.interests[0];
    } else {
        currentTopicId = topics[0].id; // Fallback
    }
    
    renderNavigation();
    loadTopic(currentTopicId);
    setupAppListeners();
}

// --- Theme & Effects ---
function setupTheme() {
    const isDark = localStorage.getItem('nexusTheme') === 'dark';
    if (isDark) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    btnThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const darkEnabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('nexusTheme', darkEnabled ? 'dark' : 'light');
        updateThemeIcon(darkEnabled);
    });
}

function updateThemeIcon(isDark) {
    btnThemeToggle.innerHTML = isDark 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
}

function setupBlobBackground() {
    const blob = document.getElementById('blob');
    if (!blob) return;

    window.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
            blob.style.left = `${e.clientX}px`;
            blob.style.top = `${e.clientY}px`;
        });
    });
}

// --- Authentication Logic ---
function renderInterestsForm() {
    interestsGrid.innerHTML = '';
    topics.forEach(topic => {
        const label = document.createElement('label');
        label.className = 'interest-checkbox';
        label.innerHTML = `
            <input type="checkbox" value="${topic.id}">
            <span>${topic.name}</span>
        `;
        interestsGrid.appendChild(label);
    });
}

function checkAuth() {
    const savedUser = localStorage.getItem('nexusUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // Backward compatibility for old users in localStorage
        if (!currentUser.interests) {
            currentUser.interests = topics.map(t => t.id);
        }
        if (!currentUser.username) {
            currentUser.username = `@${currentUser.name.replace(/\s+/g, '').toLowerCase()}`;
        }
        if (!currentUser.contact) {
            currentUser.contact = 'No contact provided';
        }
        
        showApp();
    } else {
        showLogin();
    }
}

function showLogin() {
    authOverlay.style.display = 'flex';
    appContainer.style.display = 'none';
}

function showApp() {
    authOverlay.style.display = 'none';
    appContainer.style.display = 'flex';
    startApp();
}

function setupAuthListeners() {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = studentNameInput.value.trim();
        const username = studentUsernameInput.value.trim();
        const contact = studentContactInput.value.trim();
        
        // Get selected interests
        const checkboxes = interestsGrid.querySelectorAll('input[type="checkbox"]:checked');
        const selectedInterests = Array.from(checkboxes).map(cb => cb.value);

        if (selectedInterests.length === 0) {
            showToast("Login failed: Please select at least one interest.", "error");
            return;
        }

        let pfpUrl = null;
        const file = studentPfpInput.files[0];
        if (file) {
            pfpUrl = URL.createObjectURL(file);
        }
        
        if (name && username) {
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            currentUser = { 
                name, 
                username: username.startsWith('@') ? username : `@${username}`, 
                contact, 
                initials, 
                interests: selectedInterests,
                pfp: pfpUrl
            };
            
            localStorage.setItem('nexusUser', JSON.stringify(currentUser));
            showApp();
            showToast('Login successful! Welcome to IIT KGP.', 'success');
        }
    });

    btnLogout.addEventListener('click', (e) => {
        e.stopPropagation();
        logoutOverlay.style.display = 'flex';
    });

    btnCancelLogout.addEventListener('click', () => {
        logoutOverlay.style.display = 'none';
    });

    btnConfirmLogout.addEventListener('click', () => {
        localStorage.removeItem('nexusUser');
        currentUser = null;
        logoutOverlay.style.display = 'none';
        showLogin();
    });
}

// --- Sidebar & Routing Logic ---
function renderNavigation() {
    topicNav.innerHTML = '';
    
    // Filter topics by user interests
    const userTopics = topics.filter(t => currentUser.interests.includes(t.id));
    
    userTopics.forEach(topic => {
        const navItem = document.createElement('div');
        navItem.className = `nav-item ${topic.id === currentTopicId && feedView.style.display !== 'none' ? 'active' : ''}`;
        navItem.innerHTML = `<i class="fa-solid ${topic.icon}"></i> <span>${topic.name}</span>`;
        navItem.onclick = () => {
            showFeedView();
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            navItem.classList.add('active');
            loadTopic(topic.id);
        };
        topicNav.appendChild(navItem);
    });
}

function showFeedView() {
    profileView.style.display = 'none';
    feedView.style.display = 'flex';
}

function showProfileView() {
    feedView.style.display = 'none';
    profileView.style.display = 'flex';
    
    // Remove active state from nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    populateProfileData();
    renderMyPosts();
}

function populateProfileData() {
    profilePageName.textContent = currentUser.name;
    profilePageUsername.textContent = currentUser.username;
    profilePageContact.innerHTML = `<i class="fa-solid fa-envelope"></i> ${escapeHTML(currentUser.contact || 'No contact provided')}`;
    
    if (currentUser.pfp) {
        profilePageAvatar.style.backgroundImage = `url(${currentUser.pfp})`;
        profilePageAvatar.textContent = '';
    } else {
        profilePageAvatar.style.backgroundImage = 'none';
        profilePageAvatar.textContent = currentUser.initials;
    }

    // Render interest tags
    profilePageInterests.innerHTML = '';
    const userTopics = topics.filter(t => currentUser.interests.includes(t.id));
    userTopics.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'interest-tag';
        tag.innerHTML = `<i class="fa-solid ${t.icon}"></i> ${t.name}`;
        profilePageInterests.appendChild(tag);
    });
}

// --- Edit Profile Logic ---
function openEditProfile() {
    editNameInput.value = currentUser.name || '';
    editUsernameInput.value = currentUser.username || '';
    editContactInput.value = currentUser.contact || '';
    editPfpInput.value = ''; // Can't pre-fill file input

    // Render interests grid for edit
    editInterestsGrid.innerHTML = '';
    topics.forEach(topic => {
        const label = document.createElement('label');
        label.className = 'interest-checkbox';
        const isChecked = currentUser.interests.includes(topic.id) ? 'checked' : '';
        label.innerHTML = `
            <input type="checkbox" value="${topic.id}" ${isChecked}>
            <span>${topic.name}</span>
        `;
        editInterestsGrid.appendChild(label);
    });

    editProfileOverlay.style.display = 'flex';
}

function closeEditProfile() {
    editProfileOverlay.style.display = 'none';
}

function setupEditProfileListeners() {
    btnEditProfile.addEventListener('click', openEditProfile);
    btnCancelEdit.addEventListener('click', closeEditProfile);

    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = editNameInput.value.trim();
        const username = editUsernameInput.value.trim();
        const contact = editContactInput.value.trim();
        
        const checkboxes = editInterestsGrid.querySelectorAll('input[type="checkbox"]:checked');
        const selectedInterests = Array.from(checkboxes).map(cb => cb.value);

        if (selectedInterests.length === 0) {
            showToast("Changes failed: Please select at least one interest.", "error");
            return;
        }

        let pfpUrl = currentUser.pfp; // Keep old PFP if no new one
        const file = editPfpInput.files[0];
        if (file) {
            pfpUrl = URL.createObjectURL(file);
        }

        if (name && username) {
            currentUser.name = name;
            currentUser.username = username.startsWith('@') ? username : `@${username}`;
            currentUser.contact = contact;
            currentUser.initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            currentUser.interests = selectedInterests;
            currentUser.pfp = pfpUrl;

            localStorage.setItem('nexusUser', JSON.stringify(currentUser));
            
            closeEditProfile();
            
            // Re-render the sidebar and profile view
            displayUserName.textContent = currentUser.name;
            if (currentUser.pfp) {
                userAvatar.style.backgroundImage = `url(${currentUser.pfp})`;
                userAvatar.textContent = '';
            } else {
                userAvatar.style.backgroundImage = 'none';
                userAvatar.textContent = currentUser.initials;
            }
            
            renderNavigation();
            showProfileView(); 
            showToast('Profile updated successfully!', 'success');
        }
    });
}

// --- Feed Logic ---
function loadTopic(topicId) {
    currentTopicId = topicId;
    const topic = topics.find(t => t.id === topicId);
    if(!topic) return;
    
    currentTopicTitle.textContent = topic.name;
    currentTopicDesc.textContent = topic.desc;
    
    renderNotes(notesGrid, notesData[currentTopicId] || []);
}

function renderMyPosts() {
    myNotesGrid.innerHTML = '';
    // Gather all posts by the user across all topics
    let myNotes = [];
    Object.values(notesData).forEach(topicArray => {
        const userPosts = topicArray.filter(note => note.author === currentUser.name);
        myNotes = myNotes.concat(userPosts);
    });
    
    // Sort newest first
    myNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    renderNotes(myNotesGrid, myNotes, true);
}

function renderNotes(container, notesArray, isProfile = false) {
    container.innerHTML = '';
    
    if (!isProfile) {
        noteCount.textContent = notesArray.length;
    }
    
    if (notesArray.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 60px 20px;">
                <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                <h2 style="font-family: 'Merriweather', serif; margin-bottom: 8px;">No posts yet</h2>
                <p>Be the first to publish a note.</p>
            </div>
        `;
        return;
    }

    // Reverse for feed to show newest first, MyPosts is already sorted newest first
    const displayNotes = isProfile ? notesArray : [...notesArray].reverse();

    displayNotes.forEach((note, index) => {
        const noteEl = createNoteElement(note, index, container);
        container.appendChild(noteEl);
    });
}

function createNoteElement(note, index, container) {
    const el = document.createElement('div');
    el.className = 'note';
    
    const tintIndex = note.id % cardTints.length;
    el.style.backgroundColor = cardTints[tintIndex];
    
    // Cap animation delay to avoid waiting 3 seconds for 50 posts
    const delayIndex = Math.min(index, 20);
    el.style.animationDelay = `${delayIndex * 0.05}s`;

    const timeString = new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateString = new Date(note.timestamp).toLocaleDateString();

    const isAnon = note.author === 'Anonymous';
    const authorClass = isAnon ? 'author-name anonymous' : 'author-name';
    
    let mediaHtml = '';
    if (note.media) {
        if (note.media.type === 'video') {
            mediaHtml = `<div class="note-media"><video controls src="${note.media.url}"></video></div>`;
        } else {
            mediaHtml = `<div class="note-media"><img src="${note.media.url}" alt="Post media"></div>`;
        }
    }

    let pfpStyle = '';
    let avatarContent = escapeHTML(note.avatar);
    
    // If it's the current user and they have a pfp (and it's not anon)
    if (!isAnon && note.author === currentUser.name && currentUser.pfp) {
        pfpStyle = `style="background-image: url('${currentUser.pfp}'); color: transparent;"`;
    }

    // Check if the current user owns this post to show delete button
    const canDelete = note.author === currentUser.name;
    const deleteBtnHtml = canDelete ? `
        <button class="btn-delete" title="Delete note" data-id="${note.id}">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    ` : '';

    el.innerHTML = `
        <div class="note-header">
            <div class="author-info">
                <div class="author-avatar" ${pfpStyle}>${avatarContent}</div>
                <div class="${authorClass}">${escapeHTML(note.author)}</div>
            </div>
        </div>
        <div class="note-content">${escapeHTML(note.text)}</div>
        ${mediaHtml}
        <div class="note-footer">
            <span class="timestamp"><i class="fa-regular fa-clock"></i> ${dateString} ${timeString}</span>
            ${deleteBtnHtml}
        </div>
    `;

    if (canDelete) {
        el.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNoteFromAll(note.id);
            el.style.transform = `scale(0.95)`;
            el.style.opacity = '0';
            
            // Re-render the container we are currently in
            setTimeout(() => {
                if (container.id === 'my-notes-grid') {
                    renderMyPosts();
                } else {
                    renderNotes(container, notesData[currentTopicId] || []);
                }
            }, 300);
        });
    }

    return el;
}

function setupAppListeners() {
    sidebarProfile.addEventListener('click', showProfileView);
    btnBackFeed.addEventListener('click', () => {
        showFeedView();
        // Re-highlight the current active topic in sidebar
        renderNavigation();
    });

    setupEditProfileListeners();

    if (noteInput.dataset.listenersBound) return;
    noteInput.dataset.listenersBound = "true";

    noteInput.addEventListener('input', (e) => {
        const remaining = 300 - e.target.value.length;
        charCount.textContent = `${remaining} left`;
        
        if (remaining < 20) {
            charCount.style.color = 'var(--academic-crimson)';
            charCount.style.fontWeight = '600';
        } else {
            charCount.style.color = 'var(--text-secondary)';
            charCount.style.fontWeight = 'normal';
        }
    });

    // Media Upload
    mediaUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (selectedMedia) {
            URL.revokeObjectURL(selectedMedia.url);
        }

        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        
        selectedMedia = { url, type };

        mediaPreviewContent.innerHTML = type === 'video' 
            ? `<video src="${url}" controls></video>`
            : `<img src="${url}">`;
            
        mediaPreviewContainer.style.display = 'flex';
    });

    btnRemoveMedia.addEventListener('click', clearMedia);

    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = noteInput.value.trim();
        if (!text && !selectedMedia) {
            showToast("Post failed: Cannot submit an empty post.", "error");
            return;
        }

        addNote(text);
        
        noteInput.value = '';
        anonCheckbox.checked = false;
        charCount.textContent = '300 left';
        charCount.style.color = 'var(--text-secondary)';
        clearMedia();
        showToast('Posted successfully!', 'success');
    });
    
    noteInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            noteForm.dispatchEvent(new Event('submit'));
        }
    });
}

function clearMedia() {
    selectedMedia = null;
    mediaUpload.value = '';
    mediaPreviewContent.innerHTML = '';
    mediaPreviewContainer.style.display = 'none';
}

function addNote(text) {
    const isAnon = anonCheckbox.checked;
    
    const newNote = {
        id: Date.now(),
        text: text || "",
        timestamp: new Date().toISOString(),
        author: isAnon ? "Anonymous" : currentUser.name,
        avatar: isAnon ? "?" : currentUser.initials,
        media: selectedMedia
    };
    
    notesData[currentTopicId].push(newNote);
    renderNotes(notesGrid, notesData[currentTopicId]);
}

function deleteNoteFromAll(id) {
    // Search all topics and delete
    Object.keys(notesData).forEach(topicId => {
        notesData[topicId] = notesData[topicId].filter(note => note.id !== id);
    });
}

function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- UI Utilities ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon;
    if (type === 'success') icon = 'fa-check-circle';
    else if (type === 'error') icon = 'fa-circle-xmark';
    else icon = 'fa-circle-info';
    
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHTML(message)}</span>`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// Boot
init();
