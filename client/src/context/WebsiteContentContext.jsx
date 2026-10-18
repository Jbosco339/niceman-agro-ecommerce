import React, { createContext, useEffect, useMemo, useState } from "react";
import { get as publicGet } from "../services/api";
import { getWebsiteContent as getAdminWebsiteContent } from "../services/adminService";

export const initialWebsiteContent = {};

export const WebsiteContentContext = createContext(null);

let websiteContentRequest = null;
let websiteContentCache = {};
let websiteContentLoaded = false;

export function WebsiteContentProvider({ children }) {
  const [content, setContent] = useState(
    websiteContentLoaded ? websiteContentCache : {},
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      const isAdminRoute =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin");

      if (!isAdminRoute) {
        if (websiteContentLoaded) {
          if (active) setContent(websiteContentCache);
          return;
        }

        if (websiteContentRequest) {
          if (active) setLoading(true);
          try {
            const { data } = await websiteContentRequest;
            const next = data && typeof data === "object" ? data : {};
            websiteContentCache = next;
            websiteContentLoaded = true;
            if (active) setContent(next);
          } catch {
            websiteContentCache = {};
            websiteContentLoaded = true;
            if (active) setContent({});
          } finally {
            if (active) setLoading(false);
          }
          return;
        }

        if (active) setLoading(true);
        websiteContentRequest = publicGet("/website-content")
          .then(({ data }) => {
            const next = data && typeof data === "object" ? data : {};
            websiteContentCache = next;
            websiteContentLoaded = true;
            if (active) setContent(next);
            return next;
          })
          .catch(() => {
            websiteContentCache = {};
            websiteContentLoaded = true;
            if (active) setContent({});
            return {};
          })
          .finally(() => {
            websiteContentRequest = null;
            if (active) setLoading(false);
          });
        return;
      }

      if (
        websiteContentLoaded &&
        websiteContentCache &&
        !websiteContentRequest
      ) {
        if (active) setContent(websiteContentCache);
        return;
      }

      if (active) setLoading(true);
      try {
        const { data } = await getAdminWebsiteContent();
        const next = data && typeof data === "object" ? data : {};
        websiteContentCache = next;
        websiteContentLoaded = true;
        if (active) setContent(next);
      } catch {
        websiteContentCache = {};
        websiteContentLoaded = true;
        if (active) setContent({});
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadContent();

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
