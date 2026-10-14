import React, { createContext, useEffect, useMemo, useState } from "react";
import { getWebsiteContent } from "../services/adminService";

export const initialWebsiteContent = {};

export const WebsiteContentContext = createContext(null);

export function WebsiteContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    getWebsiteContent()
      .then(({ data }) => {
        if (!active) return;
        setContent(data && typeof data === "object" ? data : {});
      })
      .catch(() => {
        if (active) setContent({});
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
    () => ({ content, setContent, loading, updateSection, setSection }),
    [content, loading],
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
