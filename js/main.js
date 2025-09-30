import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { mods } from "./mods.js";
import { screenshots } from "./screenshots.js";

// --- CONFIGURATION ---
const GITHUB_USERNAME = "astr0fel1s";
const GITHUB_REPONAME = "astr0fel1s.github.io";

// --- Draggable Elements & Window Management ---
let highestZ = 10;
const GRID_SIZE = 100;
const ICON_GRID_PADDING = 20;

function makeDraggable(element, handle) {
  let offsetX = 0,
    offsetY = 0;

  const dragMouseDown = (e) => {
    if (
      e.target.closest(".win7-controls") ||
      element.classList.contains("is-maximized")
    )
      return;
    e.preventDefault();

    if (element.classList.contains("win7-window")) {
      highestZ++;
      element.style.zIndex = highestZ;
    } else if (element.classList.contains("desktop-icon")) {
      element.classList.add("is-dragging");
    }

    const rect = element.getBoundingClientRect();
    const desktopRect = document
      .getElementById("desktop")
      .getBoundingClientRect();
    offsetX = e.clientX - (rect.left - desktopRect.left);
    offsetY = e.clientY - (rect.top - desktopRect.top);

    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
  };

  handle.onmousedown = dragMouseDown;

  const elementDrag = (e) => {
    e.preventDefault();
    const desktopRect = document
      .getElementById("desktop")
      .getBoundingClientRect();

    let newLeft = e.clientX - desktopRect.left - offsetX;
    let newTop = e.clientY - desktopRect.top - offsetY;

    newLeft = Math.max(
      0,
      Math.min(newLeft, desktopRect.width - element.offsetWidth),
    );
    newTop = Math.max(
      0,
      Math.min(newTop, desktopRect.height - element.offsetHeight),
    );

    element.style.left = newLeft + "px";
    element.style.top = newTop + "px";
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;

    if (element.classList.contains("desktop-icon")) {
      element.classList.remove("is-dragging");

      let finalLeft = parseInt(element.style.left, 10);
      let finalTop = parseInt(element.style.top, 10);
      finalLeft =
        Math.round(finalLeft / GRID_SIZE) * GRID_SIZE + ICON_GRID_PADDING;
      finalTop =
        Math.round(finalTop / GRID_SIZE) * GRID_SIZE + ICON_GRID_PADDING;
      element.style.left = finalLeft + "px";
      element.style.top = finalTop + "px";
      avoidCollisions(element);
    }
  };
}

function avoidCollisions(draggedIcon) {
  const allIcons = [...document.querySelectorAll(".desktop-icon")];
  let currentLeft = parseInt(draggedIcon.style.left, 10);
  let currentTop = parseInt(draggedIcon.style.top, 10);

  let isColliding = true;
  while (isColliding) {
    isColliding = false;
    for (const otherIcon of allIcons) {
      if (otherIcon === draggedIcon) continue;
      const otherLeft = parseInt(otherIcon.style.left, 10);
      const otherTop = parseInt(otherIcon.style.top, 10);
      if (
        Math.abs(currentLeft - otherLeft) < GRID_SIZE &&
        Math.abs(currentTop - otherTop) < GRID_SIZE
      ) {
        isColliding = true;
        currentTop += GRID_SIZE;
        const desktopRect = document
          .getElementById("desktop")
          .getBoundingClientRect();
        if (currentTop + draggedIcon.offsetHeight > desktopRect.height) {
          currentTop = ICON_GRID_PADDING;
          currentLeft += GRID_SIZE;
        }
        draggedIcon.style.left = currentLeft + "px";
        draggedIcon.style.top = currentTop + "px";
        break;
      }
    }
  }
}
document
  .querySelectorAll(".win7-window")
  .forEach((win) => makeDraggable(win, win.querySelector(".win7-title-bar")));
document
  .querySelectorAll(".desktop-icon")
  .forEach((icon) => makeDraggable(icon, icon));

// --- Window & Icon Interactions ---
document.querySelectorAll(".desktop-icon").forEach((icon) => {
  icon.addEventListener("dblclick", () => {
    const windowId = icon.dataset.windowId;
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
      windowEl.classList.remove("hidden");
      highestZ++;
      windowEl.style.zIndex = highestZ;
      // If it was minimized, remove taskbar button
      document
        .querySelector(`.taskbar-btn[data-window-id="${windowId}"]`)
        ?.remove();
      if (windowId === "personalize-window") {
        openPersonalizeModal();
      }
    }
  });
});

// Window Controls
document.querySelectorAll(".win7-window").forEach((windowEl) => {
  const windowId = windowEl.id;
  const controls = windowEl.querySelector(".win7-controls");

  controls.querySelector(".close-btn")?.addEventListener("click", () => {
    windowEl.classList.add("hidden");
    document
      .querySelector(`.taskbar-btn[data-window-id="${windowId}"]`)
      ?.remove();
  });

  controls.querySelector(".minimize-btn")?.addEventListener("click", () => {
    windowEl.classList.add("hidden");
    if (!document.querySelector(`.taskbar-btn[data-window-id="${windowId}"]`)) {
      const taskbarBtn = document.createElement("button");
      taskbarBtn.className = "taskbar-btn";
      taskbarBtn.dataset.windowId = windowId;
      taskbarBtn.textContent = windowEl.querySelector(
        ".win7-title-bar span",
      ).textContent;
      document.getElementById("taskbar-windows").appendChild(taskbarBtn);
    }
  });

  const maximizeBtn = controls.querySelector(".maximize-btn");
  if (maximizeBtn) {
    maximizeBtn.addEventListener("click", () => {
      if (windowEl.classList.contains("is-maximized")) {
        // Restore
        windowEl.style.top = windowEl.dataset.originalTop;
        windowEl.style.left = windowEl.dataset.originalLeft;
        windowEl.style.width = windowEl.dataset.originalWidth;
        windowEl.style.height = windowEl.dataset.originalHeight;
        windowEl.classList.remove("is-maximized");
      } else {
        // Maximize
        const rect = windowEl.getBoundingClientRect();
        const desktopRect = document
          .getElementById("desktop")
          .getBoundingClientRect();
        windowEl.dataset.originalTop = `${rect.top - desktopRect.top}px`;
        windowEl.dataset.originalLeft = `${rect.left - desktopRect.left}px`;
        windowEl.dataset.originalWidth = `${rect.width}px`;
        windowEl.dataset.originalHeight = `${rect.height}px`;
        windowEl.classList.add("is-maximized");
      }
    });
  }
});

// Taskbar restore functionality
document.getElementById("taskbar-windows").addEventListener("click", (e) => {
  if (e.target.matches(".taskbar-btn")) {
    const windowId = e.target.dataset.windowId;
    const windowEl = document.getElementById(windowId);
    windowEl.classList.remove("hidden");
    highestZ++;
    windowEl.style.zIndex = highestZ;
    e.target.remove();
  }
});

// Clock
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("date").textContent = now.toLocaleDateString();
}
setInterval(updateClock, 1000);
updateClock();

// --- Firebase & Personalization (Unchanged) ---
const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const welcomeMessageEl = document.getElementById("welcome-message");
const welcomeMessageInput = document.getElementById("welcome-message-input");
const wallpaperOptionsContainer = document.getElementById("wallpaper-options");
const saveSettingsBtn = document.getElementById("save-settings-btn");
let auth;
let currentSettings = {};
let selectedWallpaperUrlForSave = "";
let dynamicWallpapers = [];
async function initFirebase() {
  if (!Object.keys(firebaseConfig).length) {
    console.warn(
      "Firebase config not found. Personalization will not persist.",
    );
    applySettings({
      welcomeMessage:
        "Welcome! Personalization is offline. Set up Firebase to enable.",
    });
    return;
  }
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    auth = getAuth(app);
    if (typeof __initial_auth_token !== "undefined") {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
    listenForSettings(db, appId);
  } catch (e) {
    console.error("Firebase initialization error:", e);
  }
}
function applySettings(settings) {
  currentSettings = settings;
  if (settings.wallpaperUrl) {
    document.body.style.backgroundImage = `url('${settings.wallpaperUrl}')`;
  }
  if (settings.welcomeMessage) {
    welcomeMessageEl.textContent = settings.welcomeMessage;
  }
}
function listenForSettings(db, appId) {
  const settingsRef = doc(
    db,
    `/artifacts/${appId}/public/data/settings`,
    "website_config",
  );
  onSnapshot(settingsRef, (doc) => {
    if (doc.exists()) {
      applySettings(doc.data());
    } else {
      applySettings({
        wallpaperUrl:
          dynamicWallpapers.length > 0
            ? dynamicWallpapers[0].url
            : "https://i.postimg.cc/W1V6yC1g/windows-7-wallpaper.jpg",
        welcomeMessage: "Welcome! Double-click 'Personalize' to customize.",
      });
    }
  });
}
async function fetchWallpapersFromGitHub() {
  if (
    GITHUB_USERNAME === "YOUR_USERNAME" ||
    GITHUB_REPONAME === "YOUR_REPONAME"
  ) {
    console.warn(
      "GitHub username/repo not set. Cannot fetch dynamic wallpapers.",
    );
    return [];
  }
  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/contents/images/wallpapers`;
  const thumbsUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPONAME}/contents/images/wallpapers/thumbs`;
  try {
    const [wallpapersRes, thumbsRes] = await Promise.all([
      fetch(apiUrl),
      fetch(thumbsUrl),
    ]);
    if (!wallpapersRes.ok || !thumbsRes.ok)
      throw new Error("Failed to fetch from GitHub API");
    const wallpapersData = await wallpapersRes.json();
    const thumbsData = await thumbsRes.json();
    const thumbMap = new Map(
      thumbsData.map((thumb) => [thumb.name, thumb.download_url]),
    );
    return wallpapersData
      .filter((file) => file.type === "file" && thumbMap.has(file.name))
      .map((file) => ({
        name: file.name.split(".")[0],
        url: file.download_url,
        thumb: thumbMap.get(file.name),
      }));
  } catch (error) {
    console.error("Error fetching wallpapers:", error);
    return [];
  }
}
function openPersonalizeModal() {
  welcomeMessageInput.value = currentSettings.welcomeMessage || "";
  selectedWallpaperUrlForSave = currentSettings.wallpaperUrl || "";
  wallpaperOptionsContainer.innerHTML = "";
  dynamicWallpapers.forEach((wp) => {
    const option = document.createElement("img");
    option.src = wp.thumb;
    option.className = "wallpaper-option w-full h-20 object-cover rounded";
    if (wp.url === currentSettings.wallpaperUrl) {
      option.classList.add("selected");
    }
    option.onclick = () => {
      document
        .querySelectorAll(".wallpaper-option")
        .forEach((el) => el.classList.remove("selected"));
      option.classList.add("selected");
      selectedWallpaperUrlForSave = wp.url;
    };
    wallpaperOptionsContainer.appendChild(option);
  });
}
async function saveSettings() {
  if (!Object.keys(firebaseConfig).length) {
    alert("Cannot save settings. Firebase is not configured.");
    return;
  }
  const newSettings = {
    wallpaperUrl: selectedWallpaperUrlForSave,
    welcomeMessage: welcomeMessageInput.value || currentSettings.welcomeMessage,
  };
  const db = getFirestore();
  const settingsRef = doc(
    db,
    `/artifacts/${appId}/public/data/settings`,
    "website_config",
  );
  try {
    await setDoc(settingsRef, newSettings);
    document.getElementById("personalize-window").classList.add("hidden");
  } catch (e) {
    console.error("Error saving settings:", e);
    alert("Could not save settings.");
  }
}
saveSettingsBtn.addEventListener("click", saveSettings);

// --- Screenshot Viewer (Unchanged) ---
const gallery = document.getElementById("screenshot-gallery");
const viewerWindow = document.getElementById("image-viewer-window");
const fullSizeImage = document.getElementById("full-size-image");
const imageTitle = document.getElementById("image-title");
screenshots.forEach((screenshot) => {
  const thumbDiv = document.createElement("div");
  thumbDiv.className =
    "screenshot-thumbnail p-1 bg-white border border-gray-300 rounded cursor-pointer";
  thumbDiv.innerHTML = `<img src="${screenshot.thumbnail}" alt="${screenshot.title}" class="w-full h-auto object-cover">`;
  thumbDiv.addEventListener("click", () => {
    fullSizeImage.src = screenshot.url;
    imageTitle.textContent = screenshot.title + " - Windows Photo Viewer";
    viewerWindow.classList.remove("hidden");
    highestZ++;
    viewerWindow.style.zIndex = highestZ;
  });
  gallery.appendChild(thumbDiv);
});

// --- Mod List Generation (Unchanged) ---
const modListContainer = document.getElementById("mod-list-container");
mods
  .sort((a, b) => a.name.localeCompare(b.name))
  .forEach((mod) => {
    const modEl = document.createElement("a");
    modEl.href = mod.url;
    modEl.target = "_blank";
    modEl.rel = "noopener noreferrer";
    modEl.className = "block p-3 hover:bg-blue-200 rounded";
    modEl.innerHTML = `<h3 class="font-bold text-black">${mod.name}</h3><p class="text-sm text-gray-600">by ${mod.author}</p>`;
    modListContainer.appendChild(modEl);
  });

// --- App Initialization ---
async function initializeDesktop() {
  dynamicWallpapers = await fetchWallpapersFromGitHub();
  await initFirebase();
}
initializeDesktop();
