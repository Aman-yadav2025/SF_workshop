// --- Data Structure ---
let topics = [
    { id: 'confessions', name: 'Campus Confessions', icon: 'fa-bullhorn', desc: 'Share your thoughts anonymously' },
    { id: 'cricket', name: 'Cricket', icon: 'fa-baseball-bat-ball', desc: 'Discuss matches, teams, and practices' },
    { id: 'football', name: 'Football', icon: 'fa-futbol', desc: 'Everything about football on campus' },
    { id: 'coding', name: 'Coding', icon: 'fa-code', desc: 'Programming, tech, and dev discussions' },
    { id: 'dsa', name: 'DSA', icon: 'fa-laptop-code', desc: 'Data structures, algorithms, and prep' },
    { id: 'placements', name: 'Placements', icon: 'fa-briefcase', desc: 'Internship and placement updates' },
    { id: 'events', name: 'Campus Events', icon: 'fa-calendar-days', desc: 'Festivals, workshops, and gatherings' },
    { id: 'music', name: 'Music', icon: 'fa-music', desc: 'Jam sessions, instruments, and bands' }
];

let savedChannels = JSON.parse(localStorage.getItem('nexusCustomChannels') || '[]');
// Sanitize bad words from previous tests
const originalLen = savedChannels.length;
savedChannels = savedChannels.filter(c => !c.name.toLowerCase().includes(''));
if (savedChannels.length !== originalLen) {
    localStorage.setItem('nexusCustomChannels', JSON.stringify(savedChannels));
}
topics = [...topics, ...savedChannels];

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
const myCreatedChannelsList = document.getElementById('my-created-channels-list');
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

const deleteChannelOverlay = document.getElementById('delete-channel-overlay');
const btnCancelDeleteChannel = document.getElementById('btn-cancel-delete-channel');
const btnConfirmDeleteChannel = document.getElementById('btn-confirm-delete-channel');
let channelToDelete = null;

const toastContainer = document.getElementById('toast-container');

// Explore & Create Channel
const exploreView = document.getElementById('explore-view');
const btnExploreChannels = document.getElementById('btn-explore-channels');
const exploreChannelsGrid = document.getElementById('explore-channels-grid');
const createChannelOverlay = document.getElementById('create-channel-overlay');
const btnCreateChannel = document.getElementById('btn-create-channel');
const btnCancelCreateChannel = document.getElementById('btn-cancel-create-channel');
const createChannelForm = document.getElementById('create-channel-form');

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
        const sentences = phrases[topic.id] || ["New post in " + topic.name];
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
    setupBlobBackground();
    renderInterestsForm();
    checkAuth();
    setupAuthListeners();
    setupSidebarListeners();
    setupEditProfileListeners();
    setupFeedListeners();
    setupChannelListeners();
}

function startApp() {
    // Populate user info in sidebar
    displayUserName.textContent = currentUser.name;
    if (currentUser.pfp) {
        userAvatar.style.backgroundImage = `url(${currentUser.pfp})`;
        userAvatar.style.color = 'transparent';
        userAvatar.innerHTML = '';
    } else {
        userAvatar.style.backgroundImage = 'none';
        userAvatar.style.color = 'white';
        userAvatar.innerHTML = escapeHTML(currentUser.initials);
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
        const iconHtml = topic.iconUrl ? `<img src="${topic.iconUrl}" class="custom-tag-icon">` : (topic.icon ? `<i class="fa-solid ${topic.icon}"></i>` : '');
        label.innerHTML = `
            <input type="checkbox" value="${topic.id}">
            <span>${iconHtml} ${topic.name}</span>
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

        const file = studentPfpInput.files[0];
        
        const finalizeLogin = (pfpBase64) => {
            if (name && username) {
                const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                currentUser = { 
                    name, 
                    username: username.startsWith('@') ? username : `@${username}`, 
                    contact, 
                    initials, 
                    interests: selectedInterests,
                    pfp: pfpBase64
                };
                
                localStorage.setItem('nexusUser', JSON.stringify(currentUser));
                showApp();
                showToast('Login successful! Welcome to IIT KGP.', 'success');
            }
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => finalizeLogin(e.target.result);
            reader.readAsDataURL(file);
        } else {
            finalizeLogin(null);
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
        loginForm.reset(); // Clear login form inputs (including PFP)
        createChannelForm.reset();
        editProfileForm.reset();
        renderInterestsForm(); // Re-render interests to reflect any new channels or reset state
        showLogin();
    });
}

// --- Sidebar & Routing Logic ---
function setupSidebarListeners() {
    sidebarProfile.addEventListener('click', showProfileView);
    btnBackFeed.addEventListener('click', () => {
        showFeedView();
        renderNavigation();
    });
}

function renderNavigation() {
    topicNav.innerHTML = '';
    
    // Filter topics by user interests
    const userTopics = topics.filter(t => currentUser.interests.includes(t.id));
    
    userTopics.forEach(topic => {
        const navItem = document.createElement('div');
        navItem.className = `nav-item ${topic.id === currentTopicId && feedView.style.display !== 'none' ? 'active' : ''}`;
        
        const iconHtml = topic.iconUrl ? `<img src="${topic.iconUrl}" class="custom-nav-icon">` : `<i class="fa-solid ${topic.icon}"></i>`;
        
        navItem.innerHTML = `${iconHtml} <span>${topic.name}</span>`;
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
    exploreView.style.display = 'none';
    feedView.style.display = 'flex';
}

function showProfileView() {
    feedView.style.display = 'none';
    exploreView.style.display = 'none';
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
        profilePageAvatar.style.color = 'transparent';
        profilePageAvatar.innerHTML = '';
    } else {
        profilePageAvatar.style.backgroundImage = 'none';
        profilePageAvatar.style.color = 'white';
        profilePageAvatar.innerHTML = escapeHTML(currentUser.initials);
    }

    // Render interest tags
    profilePageInterests.innerHTML = '';
    const userTopics = topics.filter(t => currentUser.interests.includes(t.id));
    if (userTopics.length === 0) {
        profilePageInterests.innerHTML = '<span style="color: var(--text-secondary);">No channels joined.</span>';
    } else {
        userTopics.forEach(t => {
            const tag = document.createElement('span');
            tag.className = 'interest-tag';
            tag.style.cursor = 'pointer';
            tag.title = 'Click to open channel';
            
            const iconHtml = t.iconUrl ? `<img src="${t.iconUrl}" class="custom-tag-icon">` : `<i class="fa-solid ${t.icon}"></i>`;
            tag.innerHTML = `${iconHtml} ${t.name}`;
            
            tag.addEventListener('click', () => {
                showFeedView();
                document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                // Set active nav item
                document.querySelectorAll('.nav-item').forEach(item => {
                    if(item.textContent.includes(t.name)) item.classList.add('active');
                });
                loadTopic(t.id);
            });
            profilePageInterests.appendChild(tag);
        });
    }
    
    // Render My Created Channels
    myCreatedChannelsList.innerHTML = '';
    const myChannels = topics.filter(t => t.createdBy === currentUser.username);
    
    if (myChannels.length === 0) {
        myCreatedChannelsList.innerHTML = '<p style="color: var(--text-secondary);">You have not created any channels yet.</p>';
    } else {
        myChannels.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'channel-card';
            const iconHtml = topic.iconUrl ? `<img src="${topic.iconUrl}" class="custom-card-icon">` : `<i class="fa-solid ${topic.icon}"></i>`;
            
            card.innerHTML = `
                <div class="channel-header">
                    <div class="channel-icon">${iconHtml}</div>
                    <div class="channel-info">
                        <h3>${escapeHTML(topic.name)}</h3>
                        <p>${escapeHTML(topic.desc)}</p>
                    </div>
                </div>
                <div class="channel-actions">
                    <button class="btn-primary btn-view-created-channel" data-id="${topic.id}" style="flex: 1;">
                        <i class="fa-solid fa-arrow-right"></i> Open
                    </button>
                    <button class="btn-secondary btn-delete-created-channel" data-id="${topic.id}" style="flex: 1; border-color: var(--academic-crimson); color: var(--academic-crimson);">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </div>
            `;
            myCreatedChannelsList.appendChild(card);
        });
        
        document.querySelectorAll('.btn-view-created-channel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topicId = e.currentTarget.getAttribute('data-id');
                const topic = topics.find(t => t.id === topicId);
                
                // If they haven't joined their own channel, auto-join it
                if (!currentUser.interests.includes(topicId)) {
                    currentUser.interests.push(topicId);
                    localStorage.setItem('nexusUser', JSON.stringify(currentUser));
                    renderNavigation();
                }
                
                showFeedView();
                document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(item => {
                    if(item.textContent.includes(topic.name)) item.classList.add('active');
                });
                loadTopic(topicId);
            });
        });

        document.querySelectorAll('.btn-delete-created-channel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                channelToDelete = e.currentTarget.getAttribute('data-id');
                deleteChannelOverlay.style.display = 'flex';
            });
        });
    }
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

        const file = editPfpInput.files[0];
        
        const finalizeEdit = (pfpBase64) => {
            if (name && username) {
                currentUser.name = name;
                currentUser.username = username.startsWith('@') ? username : `@${username}`;
                currentUser.contact = contact;
                currentUser.initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                currentUser.interests = selectedInterests;
                
                // If a new file was uploaded use base64, otherwise keep old
                currentUser.pfp = pfpBase64 ? pfpBase64 : currentUser.pfp;

                localStorage.setItem('nexusUser', JSON.stringify(currentUser));
                
                closeEditProfile();
                
                // Re-render the sidebar and profile view
                displayUserName.textContent = currentUser.name;
                if (currentUser.pfp) {
                    userAvatar.style.backgroundImage = `url(${currentUser.pfp})`;
                    userAvatar.style.color = 'transparent';
                    userAvatar.innerHTML = '';
                } else {
                    userAvatar.style.backgroundImage = 'none';
                    userAvatar.style.color = 'white';
                    userAvatar.innerHTML = escapeHTML(currentUser.initials);
                }
                
                renderNavigation();
                showProfileView(); 
                showToast('Profile updated successfully!', 'success');
            }
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => finalizeEdit(e.target.result);
            reader.readAsDataURL(file);
        } else {
            finalizeEdit(null);
        }
    });
}

// --- Feed Logic ---
function setupFeedListeners() {
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

    mediaUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file);
                selectedMedia = { url, type: file.type };
                
                mediaPreviewContainer.style.display = 'block';
                if (file.type.startsWith('image/')) {
                    mediaPreviewContainer.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 200px; border-radius: 8px;"><button type="button" class="btn-remove-media" id="btn-remove-media"><i class="fa-solid fa-xmark"></i></button>`;
                } else if (file.type.startsWith('video/')) {
                    mediaPreviewContainer.innerHTML = `<video src="${url}" style="max-width: 100%; max-height: 200px; border-radius: 8px;" controls></video><button type="button" class="btn-remove-media" id="btn-remove-media"><i class="fa-solid fa-xmark"></i></button>`;
                } else if (file.type.startsWith('audio/')) {
                    mediaPreviewContainer.innerHTML = `<audio src="${url}" controls style="width: 100%; margin-top: 10px;"></audio><button type="button" class="btn-remove-media" id="btn-remove-media"><i class="fa-solid fa-xmark"></i></button>`;
                }
                document.getElementById('btn-remove-media').addEventListener('click', clearMedia);
            } else {
                showToast('Unsupported file type', 'error');
            }
        }
    });
}

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
    let myNotes = [];
    Object.values(notesData).forEach(topicArray => {
        const userPosts = topicArray.filter(note => note.author === currentUser.name);
        myNotes = myNotes.concat(userPosts);
    });
    myNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    renderNotes(myNotesGrid, myNotes, true);
}

function renderNotes(container, notesArray, isProfile = false) {
    container.innerHTML = '';
    
    if (!isProfile) {
        noteCount.textContent = notesArray.length;
    }
    
    if (notesArray.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 60px 20px;"><i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i><h2 style="font-family: 'Merriweather', serif; margin-bottom: 8px;">No posts yet</h2></div>`;
        return;
    }

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
    
    const delayIndex = Math.min(index, 20);
    el.style.animationDelay = `${delayIndex * 0.05}s`;

    const timeString = new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateString = new Date(note.timestamp).toLocaleDateString();

    const isAnon = note.author === 'Anonymous';
    const authorClass = isAnon ? 'author-name anonymous' : 'author-name';
    
    let pfpStyle = '';
    let avatarContent = escapeHTML(note.avatar);
    
    if (!isAnon && note.author === currentUser.name && currentUser.pfp) {
        pfpStyle = `style="background-image: url('${currentUser.pfp}'); color: transparent;"`;
    }

    const canDelete = note.author === currentUser.name;
    const deleteBtnHtml = canDelete ? `<button class="btn-delete" title="Delete note" data-id="${note.id}"><i class="fa-solid fa-trash-can"></i></button>` : '';

    el.innerHTML = `
        <div class="note-header">
            <div class="author-info">
                <div class="author-avatar" ${pfpStyle}>${avatarContent}</div>
                <div class="${authorClass}">${escapeHTML(note.author)}</div>
            </div>
        </div>
        <div class="note-content">${escapeHTML(note.text)}</div>
        <div class="note-footer">
            <span class="timestamp"><i class="fa-regular fa-clock"></i> ${dateString} ${timeString}</span>
            ${deleteBtnHtml}
        </div>
    `;

    if (note.media) {
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'note-media';
        if (note.media.type.startsWith('image/')) {
            mediaDiv.innerHTML = `<img src="${note.media.url}" alt="Post attachment">`;
        } else if (note.media.type.startsWith('video/')) {
            mediaDiv.innerHTML = `<video src="${note.media.url}" controls></video>`;
        } else if (note.media.type.startsWith('audio/')) {
            mediaDiv.innerHTML = `<audio src="${note.media.url}" controls></audio>`;
        }
        el.appendChild(mediaDiv);
    }

    if (canDelete) {
        el.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNoteFromAll(note.id);
            el.style.opacity = '0';
            setTimeout(() => {
                if (container.id === 'my-notes-grid') renderMyPosts();
                else renderNotes(container, notesData[currentTopicId] || []);
            }, 300);
        });
    }

    return el;
}

function setupAppListeners() {
    if (noteForm.dataset.submitBound) return;
    noteForm.dataset.submitBound = "true";
    
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

// --- Channel Management ---
function setupChannelListeners() {
    btnExploreChannels.addEventListener('click', showExploreView);
    
    btnCreateChannel.addEventListener('click', () => {
        createChannelOverlay.style.display = 'flex';
    });
    
    btnCancelCreateChannel.addEventListener('click', () => {
        createChannelOverlay.style.display = 'none';
    });
    
    createChannelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-channel-name').value.trim();
        const desc = document.getElementById('new-channel-desc').value.trim();
        const iconRadio = document.querySelector('input[name="channel-icon"]:checked');
        const customIconFile = document.getElementById('channel-custom-icon').files[0];
        
        if (!name || !desc) {
            showToast('Please fill all required fields', 'error');
            return;
        }
        
        if (!iconRadio && !customIconFile) {
            showToast('Please select an icon or upload a custom image', 'error');
            return;
        }
        
        const finalizeChannel = (customIconDataUrl) => {
            const id = 'ch_' + Date.now();
            const newChannel = {
                id,
                name,
                desc,
                createdBy: currentUser.username
            };
            
            if (customIconDataUrl) {
                newChannel.iconUrl = customIconDataUrl;
            } else {
                newChannel.icon = iconRadio.value;
            }
            
            // Add to topics & save
            topics.push(newChannel);
            const savedCustomChannels = JSON.parse(localStorage.getItem('nexusCustomChannels') || '[]');
            savedCustomChannels.push(newChannel);
            localStorage.setItem('nexusCustomChannels', JSON.stringify(savedCustomChannels));
            
            // Add to user interests
            currentUser.interests.push(id);
            localStorage.setItem('nexusUser', JSON.stringify(currentUser));
            
            // Init notes array
            notesData[id] = [];
            
            createChannelOverlay.style.display = 'none';
            createChannelForm.reset();
            
            renderNavigation();
            currentTopicId = id;
            showFeedView();
            showToast('Channel created successfully!', 'success');
        };
        
        if (customIconFile) {
            const reader = new FileReader();
            reader.onload = (e) => finalizeChannel(e.target.result);
            reader.readAsDataURL(customIconFile);
        } else {
            finalizeChannel(null);
        }
    });

    btnCancelDeleteChannel.addEventListener('click', () => {
        deleteChannelOverlay.style.display = 'none';
        channelToDelete = null;
    });

    btnConfirmDeleteChannel.addEventListener('click', () => {
        if (!channelToDelete) return;
        
        // Remove from topics globally
        topics = topics.filter(t => t.id !== channelToDelete);
        
        // Remove from custom channels local storage
        let savedCustomChannels = JSON.parse(localStorage.getItem('nexusCustomChannels') || '[]');
        savedCustomChannels = savedCustomChannels.filter(t => t.id !== channelToDelete);
        localStorage.setItem('nexusCustomChannels', JSON.stringify(savedCustomChannels));
        
        // Remove from currentUser interests
        currentUser.interests = currentUser.interests.filter(id => id !== channelToDelete);
        localStorage.setItem('nexusUser', JSON.stringify(currentUser));
        
        // Delete notes
        delete notesData[channelToDelete];
        
        // Close modal
        deleteChannelOverlay.style.display = 'none';
        channelToDelete = null;
        
        // Re-render
        renderNavigation();
        populateProfileData(); // if on profile page
        
        // If current topic is deleted, go to a safe topic
        if (currentTopicId === channelToDelete) {
            currentTopicId = currentUser.interests[0] || topics[0].id;
            loadTopic(currentTopicId);
        }
        
        showToast('Channel deleted successfully', 'success');
    });
}

function showExploreView() {
    document.getElementById('feed-view').style.display = 'none';
    document.getElementById('profile-view').style.display = 'none';
    exploreView.style.display = 'flex';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    btnExploreChannels.classList.add('active');
    
    renderExploreChannels();
}

function renderExploreChannels() {
    exploreChannelsGrid.innerHTML = '';
    topics.forEach(topic => {
        const isJoined = currentUser.interests.includes(topic.id);
        const card = document.createElement('div');
        card.className = 'channel-card';
        const iconHtml = topic.iconUrl ? `<img src="${topic.iconUrl}" class="custom-card-icon">` : `<i class="fa-solid ${topic.icon}"></i>`;
        
        card.innerHTML = `
            <div class="channel-header">
                <div class="channel-icon">${iconHtml}</div>
                <div class="channel-info">
                    <h3>${escapeHTML(topic.name)}</h3>
                    <p>${escapeHTML(topic.desc)}</p>
                </div>
            </div>
            <div class="channel-actions">
                <button class="btn-${isJoined ? 'secondary' : 'primary'} w-100 toggle-join-btn" data-id="${topic.id}" style="width: 100%;">
                    ${isJoined ? 'Leave Channel' : 'Join Channel'}
                </button>
            </div>
        `;
        exploreChannelsGrid.appendChild(card);
    });
    
    document.querySelectorAll('.toggle-join-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const isJoined = currentUser.interests.includes(id);
            if (isJoined) {
                if (currentUser.interests.length <= 1) {
                    showToast('You must be in at least one channel', 'error');
                    return;
                }
                currentUser.interests = currentUser.interests.filter(i => i !== id);
                showToast(`Left channel`, 'success');
            } else {
                currentUser.interests.push(id);
                showToast(`Joined channel`, 'success');
            }
            localStorage.setItem('nexusUser', JSON.stringify(currentUser));
            renderNavigation();
            renderExploreChannels();
        });
    });
}

// Boot
init();
