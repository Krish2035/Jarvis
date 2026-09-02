/**
 * JARVIS PWA Manager & Service Worker Controller
 */

let deferredInstallPrompt = null;
const installListeners = new Set();
const onlineListeners = new Set();

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[JARVIS PWA]: Service Worker successfully initialized with scope:', reg.scope);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[JARVIS PWA]: New Mark VII neural update available.');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[JARVIS PWA]: Service Worker registration failed:', err);
        });
    });
  }

  // Intercept PWA Install Prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('[JARVIS PWA]: PWA install protocol triggered.');
    notifyInstallListeners(true);
  });

  // Track app installation completion
  window.addEventListener('appinstalled', () => {
    console.log('[JARVIS PWA]: Application successfully installed to host OS.');
    deferredInstallPrompt = null;
    notifyInstallListeners(false);
  });

  // Network connectivity status listeners
  window.addEventListener('online', () => notifyOnlineListeners(true));
  window.addEventListener('offline', () => notifyOnlineListeners(false));
};

export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

export const isInstallPromptAvailable = () => {
  return deferredInstallPrompt !== null;
};

export const triggerPWAInstall = async () => {
  if (!deferredInstallPrompt) {
    console.log('[JARVIS PWA]: No deferred install prompt available.');
    return false;
  }

  deferredInstallPrompt.prompt();
  const choiceResult = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  notifyInstallListeners(false);
  return choiceResult.outcome === 'accepted';
};

export const subscribeInstallPrompt = (callback) => {
  installListeners.add(callback);
  callback(Boolean(deferredInstallPrompt));
  return () => installListeners.delete(callback);
};

export const subscribeOnlineStatus = (callback) => {
  onlineListeners.add(callback);
  callback(navigator.onLine);
  return () => onlineListeners.delete(callback);
};

const notifyInstallListeners = (available) => {
  installListeners.forEach((cb) => cb(available));
};

const notifyOnlineListeners = (isOnline) => {
  onlineListeners.forEach((cb) => cb(isOnline));
};
