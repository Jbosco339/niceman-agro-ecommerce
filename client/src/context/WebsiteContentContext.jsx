import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  websiteContentSeed,
  readLocalStorage,
  writeLocalStorage,
} from "../data/mockData";

export const initialWebsiteContent = websiteContentSeed;

export const WebsiteContentContext = createContext(null);

export function WebsiteContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    const saved = readLocalStorage(
      "niceman-website-content",
      websiteContentSeed,
    );
    return saved && Object.keys(saved).length ? saved : websiteContentSeed;
  });

  useEffect(() => {
    writeLocalStorage("niceman-website-content", content);
  }, [content]);

  const updateSection = (section, updates) => {
    setContent((cur) => ({
      ...cur,
      [section]: { ...(cur[section] || {}), ...updates },
    }));
  };

  const setSection = (section, value) => {
    setContent((cur) => ({ ...cur, [section]: value }));
  };

  const value = useMemo(
    () => ({ content, setContent, updateSection, setSection }),
    [content],
  );

  return (
    <WebsiteContentContext.Provider value={value}>
      {children}
    </WebsiteContentContext.Provider>
  );
}

export function useWebsiteContentContext() {
  const ctx = React.useContext(WebsiteContentContext);
  if (!ctx)
    throw new Error(
      "useWebsiteContentContext must be used within a WebsiteContentProvider",
    );
  return ctx;
}
