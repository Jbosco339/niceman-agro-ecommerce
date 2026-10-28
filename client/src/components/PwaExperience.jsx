import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Cookie,
  Download,
  RefreshCw,
  Smartphone,
  X,
} from "lucide-react";
import { registerSW } from "virtual:pwa-register";

const CONSENT_STORAGE_KEY = "niceman-cookie-consent";

const readCookieConsent = () => {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to read cookie consent preference:", error);
    return null;
  }
};

function PwaExperience() {
  const isAppleMobile = /iPhone|iPad|iPod/i.test(window.navigator.userAgent);
  const [cookieConsent, setCookieConsent] = useState(readCookieConsent);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const updateApp = useRef(null);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const syncInstalledState = () => {
      setIsInstalled(
        standaloneQuery.matches || window.navigator.standalone === true,
      );
    };
    const handleInstallAvailable = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    syncInstalledState();
    window.addEventListener("beforeinstallprompt", handleInstallAvailable);
    window.addEventListener("appinstalled", handleInstalled);
    standaloneQuery.addEventListener?.("change", syncInstalledState);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleInstalled);
      standaloneQuery.removeEventListener?.("change", syncInstalledState);
    };
  }, []);

  useEffect(() => {
    let active = true;
    let updateCheck;

    try {
      updateApp.current = registerSW({
        immediate: true,
        onNeedRefresh() {
          if (!active) return;
          setUpdateAvailable(true);
          setShowUpdatePrompt(true);
        },
        onRegisteredSW(_serviceWorkerUrl, registration) {
          if (!registration) return;
          updateCheck = window.setInterval(() => {
            registration.update().catch((error) => {
              console.error("Unable to check for app updates:", error);
            });
          }, 60 * 1000);
        },
        onRegisterError(error) {
          console.error("Unable to register the app service worker:", error);
        },
      });
    } catch (error) {
      console.error("Unable to initialize app updates:", error);
    }

    return () => {
      active = false;
      if (updateCheck) window.clearInterval(updateCheck);
    };
  }, []);

  useEffect(() => {
    if (!updateAvailable || showUpdatePrompt || updating) return undefined;
    const timer = window.setTimeout(() => setShowUpdatePrompt(true), 10_000);
    return () => window.clearTimeout(timer);
  }, [updateAvailable, showUpdatePrompt, updating]);

  const saveCookieConsent = (choice) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch (error) {
      console.warn("Unable to save cookie consent preference:", error);
    }
    setCookieConsent(choice);
  };

  const installApp = async () => {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setIsInstalled(true);
    } catch (error) {
      console.error("Unable to start app installation:", error);
      setShowInstallHelp(true);
    } finally {
      setInstallPrompt(null);
    }
  };

  const applyUpdate = async () => {
    if (!updateApp.current) return;
    setUpdating(true);
    setUpdateError("");
    try {
      await updateApp.current(true);
    } catch (error) {
      console.error("Unable to apply app update:", error);
      setUpdateError("The update could not be installed. Please try again.");
      setUpdating(false);
    }
  };

  return (
    <>
      {!isInstalled && (
        <button
          type="button"
          onClick={installApp}
          className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-green-800 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-green-700/30"
        >
          <Download size={17} />
          Install app
        </button>
      )}

      {cookieConsent === null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="rounded-xl bg-green-50 p-3 text-green-800">
                <Cookie size={23} />
              </span>
              <div>
                <h2
                  id="cookie-consent-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Cookies & privacy
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We use essential browser storage and cookies to keep your
                  account secure and remember your cart and preferences. You
                  can read how we handle personal information in our{" "}
                  <Link
                    to="/privacy"
                    onClick={() => saveCookieConsent("essential")}
                    className="font-semibold text-green-800 underline"
                  >
                    Privacy Policy
                  </Link>
                  . No advertising cookies are used by this app.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => saveCookieConsent("essential")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={() => saveCookieConsent("accepted")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
              >
                <Check size={16} />
                Accept & continue
              </button>
            </div>
          </section>
        </div>
      )}

      {showInstallHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-help-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Smartphone className="mb-3 text-green-800" size={28} />
                <h2
                  id="install-help-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Install Niceman Agro
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallHelp(false)}
                aria-label="Close install instructions"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isAppleMobile ? (
                <>
                  Open the Share menu in Safari and choose{" "}
                  <strong>Add to Home Screen</strong>. Installation is
                  available when this site is open over HTTPS.
                </>
              ) : (
                <>
                  Open your browser menu and choose{" "}
                  <strong>Install app</strong> or{" "}
                  <strong>Add to Home Screen</strong>. Installation is
                  available when this site is open over HTTPS in a supported
                  browser.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setShowInstallHelp(false)}
              className="mt-6 w-full rounded-lg bg-green-800 px-4 py-3 font-semibold text-white hover:bg-green-900"
            >
              Got it
            </button>
          </section>
        </div>
      )}

      {showUpdatePrompt && updateAvailable && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="app-update-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-800">
              <RefreshCw size={25} />
            </span>
            <h2
              id="app-update-title"
              className="mt-4 text-xl font-bold text-slate-900"
            >
              An app update is available
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Update now to get the latest version of Niceman Agro.
            </p>
            {updateError && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {updateError}
              </p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                disabled={updating}
                onClick={() => setShowUpdatePrompt(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60"
              >
                Not now
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={applyUpdate}
                className="inline-flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {updating && <RefreshCw size={15} className="animate-spin" />}
                {updating ? "Updating…" : "Update app"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default PwaExperience;
