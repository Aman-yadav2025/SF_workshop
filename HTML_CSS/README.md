# Developer Guide: Building the IIT KGP Community Boards

This document serves as a comprehensive feature list and a step-by-step developer guide. It explains the core features of the application and provides tutorials on how to implement them from scratch using purely HTML, CSS, and Vanilla JavaScript.

---

## 1. Core Architecture & Routing (Single Page Application)
**Feature**: The app runs entirely on a single HTML page, swapping between the "Feed View", "Profile View", and "Explore View" seamlessly without reloading the browser.
**How to build it**:
- **HTML**: Wrap your views in `<main>` or `<div>` tags with distinct IDs (e.g., `#feed-view`, `#profile-view`, `#explore-view`). Set `style="display: none;"` on the views that shouldn't be visible initially.
- **JavaScript**: Create simple routing functions that toggle the `display` properties.
```javascript
function showProfileView() {
    document.getElementById('feed-view').style.display = 'none';
    document.getElementById('explore-view').style.display = 'none';
    document.getElementById('profile-view').style.display = 'flex';
}
```

## 2. Dynamic Theming (Dark Mode)
**Feature**: A toggle button switches the entire app between a light collegiate theme and a sleek dark mode, saving the preference locally.
**How to build it**:
- **CSS**: Define all your colors using CSS variables in the `:root` selector. Then, define a `.dark-mode` class on the `body` that overwrites those variables.
```css
:root { --bg-main: #f4f6f8; --text: #1e293b; }
body.dark-mode { --bg-main: #0b1120; --text: #f8fafc; }
```
- **JavaScript**: Toggle the class on the body and save the state to `localStorage`.
```javascript
document.getElementById('btn-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
```

## 3. Local Authentication & Onboarding
**Feature**: A modal overlay captures user details (Name, Username, Profile Picture) before letting them access the app. It persists via `localStorage`.
**How to build it**:
- **HTML**: Create a full-screen fixed modal (`position: fixed; z-index: 1000`).
- **JavaScript**: On form submission, package the input values into a JSON object and save it using `JSON.stringify()`.
```javascript
const user = { name: "Aman", username: "@aman", interests: ["coding"] };
localStorage.setItem('nexusUser', JSON.stringify(user));
```
- On page load, check if `localStorage.getItem('nexusUser')` exists to bypass login.

## 4. Base64 Image Persistence (Custom Icons & PFPs)
**Feature**: Users can upload custom images for their Profile Picture or Channel Icons, and they persist flawlessly across browser reloads.
**How to build it**:
- **Concept**: If you use `URL.createObjectURL(file)`, the URL breaks on page reload. Instead, read the image file as a Base64 data string.
- **JavaScript**: Use the `FileReader` API.
```javascript
const file = fileInput.files[0];
const reader = new FileReader();
reader.onload = (e) => {
    const base64String = e.target.result; // Data URL
    user.pfp = base64String;
    localStorage.setItem('nexusUser', JSON.stringify(user));
};
reader.readAsDataURL(file);
```
> [!TIP]
> Storing Base64 strings in `localStorage` works great for small images, but has a 5MB storage limit in most browsers.

## 5. Dynamic Custom Channels & Ownership
**Feature**: Users can dynamically create custom channels, assign them custom icons, and delete the ones they own.
**How to build it**:
- **JavaScript Architecture**: 
  - Store a base array of default `topics`.
  - On page load, fetch `customChannels` from `localStorage` and merge them: `topics = [...defaultTopics, ...customChannels]`.
  - When creating a channel, attach a `createdBy: currentUser.username` property to the channel object.
- **Deletion Logic**: Filter out the channel ID from global topics, the `localStorage` custom channels array, and user `interests`, then rewrite `localStorage`.

## 6. Channel Discovery (Explore View)
**Feature**: An overarching directory page displaying all channels, allowing users to effortlessly join or leave them.
**How to build it**:
- **JavaScript Rendering**: Loop through the `topics` array and generate DOM cards. Check `currentUser.interests.includes(topic.id)` to determine if the button should say "Join" or "Leave".
- **Toggle Logic**: If leaving, filter the ID out of the interests array. If joining, `push()` the ID in.

## 7. Media Uploads & Native Audio Player
**Feature**: Users can upload images, videos, and audio clips into the feed. The app automatically detects the file type and renders the appropriate HTML player.
**How to build it**:
- **HTML**: Use `<input type="file" accept="image/*,video/*,audio/*">`.
- **JavaScript**: Check the `file.type` property.
```javascript
if (file.type.startsWith('audio/')) {
    mediaDiv.innerHTML = `<audio src="${url}" controls></audio>`;
} else if (file.type.startsWith('video/')) {
    mediaDiv.innerHTML = `<video src="${url}" controls></video>`;
}
```

## 8. Toast Notification System
**Feature**: Animated popups appear in the bottom corner to indicate successes or errors (e.g., "Channel Created!", "Please fill all fields").
**How to build it**:
- **CSS**: Create a fixed container at `bottom: 24px; right: 24px;`. Define a `.toast` class with a slide-in animation.
- **JavaScript**: Write a reusable function that creates a `div`, appends it to the container, and sets a timeout to remove it.
```javascript
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
```

## 9. Glassmorphism Aurora Background
**Feature**: A glowing gradient orb smoothly follows the user's cursor behind the application, creating a premium, dynamic feel.
**How to build it**:
- **CSS**: Create a fixed, absolute-positioned `div` with a gradient background and a massive blur filter.
```css
#blob {
    position: absolute; width: 300px; height: 300px;
    background: linear-gradient(135deg, red, gold);
    filter: blur(100px); border-radius: 50%;
}
```
- **JavaScript**: Use `requestAnimationFrame` for buttery-smooth mouse tracking.

## 10. Massive Procedural Mock Data
**Feature**: The app feels instantly alive by automatically generating realistic, randomized posts when it first loads.
**How to build it**:
- **JavaScript**: Create arrays of mock names and topic-specific phrases. Loop through each topic 50 times, randomly selecting a name, a phrase, and generating a random past timestamp.
```javascript
const names = ["Alex", "Jordan", "Taylor"];
const phrases = ["Just solved a Leetcode hard!", "Looking for a hackathon team."];
for(let i=0; i<50; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    // Push {author: randomName, text: randomPhrase} to your posts array.
}
```
