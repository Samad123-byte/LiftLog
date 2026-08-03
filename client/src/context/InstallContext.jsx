import { createContext, useContext, useEffect, useState } from "react";

const InstallContext = createContext(null);

export function InstallProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    const beforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const installedHandler = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <InstallContext.Provider
      value={{
        installed,
        canInstall: !!deferredPrompt,
        install,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}

export function useInstall() {
  const context = useContext(InstallContext);

  if (!context) {
    throw new Error("useInstall must be used inside InstallProvider");
  }

  return context;
}