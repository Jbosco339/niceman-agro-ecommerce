import { useEffect, useState } from "react";
import { getWebsiteContent, updateWebsiteContent } from "../../../services/adminService";

export default function WebsiteContent() {
  const [activeTab, setActiveTab] = useState("hero");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [content, setContent] = useState({
    hero: {
      title: "Fresh From Our Farm to Your Table",
      subtitle:
        "Quality farm produce delivered fresh to your doorstep.",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      image: "/images/hero-bg.jpg",
    },

    about: {
      title: "About Niceman Agro & Farms",
      description:
        "We provide fresh, quality agricultural products sourced from trusted farms and delivered to customers with care.",
      image: "/images/about.jpg",
    },

    contact: {
      phone: "+234 801 234 5678",
      email: "info@nicemanagro.com",
      address: "Lagos, Nigeria",
      whatsapp: "+234 801 234 5678",
    },

    footer: {
      description:
        "Quality farm produce delivered fresh to your doorstep.",
      copyright: "© 2026 Niceman Agro & Farms. All rights reserved.",
    },
  });

  useEffect(() => {
    getWebsiteContent()
      .then(({ data }) => {
        if (data && Object.keys(data).length) {
          setContent((current) => ({
            ...current,
            ...data,
            hero: { ...current.hero, ...data.hero },
            about: { ...current.about, ...data.about },
            contact: { ...current.contact, ...data.contact },
            footer: { ...current.footer, ...data.footer },
          }));
        }
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const updateContent = (section, field, value) => {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await updateWebsiteContent(content);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "about", label: "About Section" },
    { id: "contact", label: "Contact Information" },
    { id: "footer", label: "Footer" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Website Content
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the content displayed across your website.
        </p>
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {saved && <p role="status" className="mb-4 text-sm text-green-700">Website content saved.</p>}

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        <div className="flex min-w-max border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      {activeTab === "hero" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Hero Section
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Edit the main content displayed on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Heading
              </label>

              <input
                type="text"
                value={content.hero.title}
                onChange={(e) =>
                  updateContent("hero", "title", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Button Text
              </label>

              <input
                type="text"
                value={content.hero.buttonText}
                onChange={(e) =>
                  updateContent("hero", "buttonText", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subtitle
              </label>

              <textarea
                rows="4"
                value={content.hero.subtitle}
                onChange={(e) =>
                  updateContent("hero", "subtitle", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Button Link
              </label>

              <input
                type="text"
                value={content.hero.buttonLink}
                onChange={(e) =>
                  updateContent("hero", "buttonLink", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hero Image URL
              </label>

              <input
                type="text"
                value={content.hero.image}
                onChange={(e) =>
                  updateContent("hero", "image", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
          >
            Save Hero Content
          </button>
        </div>
      )}

      {/* About Section */}
      {activeTab === "about" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              About Section
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the information shown in the About section.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Section Title
              </label>

              <input
                type="text"
                value={content.about.title}
                onChange={(e) =>
                  updateContent("about", "title", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                rows="6"
                value={content.about.description}
                onChange={(e) =>
                  updateContent("about", "description", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image URL
              </label>

              <input
                type="text"
                value={content.about.image}
                onChange={(e) =>
                  updateContent("about", "image", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
          >
            Save About Content
          </button>
        </div>
      )}

      {/* Contact Section */}
      {activeTab === "contact" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the contact details displayed on the website.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <input
                type="text"
                value={content.contact.phone}
                onChange={(e) =>
                  updateContent("contact", "phone", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={content.contact.email}
                onChange={(e) =>
                  updateContent("contact", "email", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                type="text"
                value={content.contact.address}
                onChange={(e) =>
                  updateContent("contact", "address", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>

              <input
                type="text"
                value={content.contact.whatsapp}
                onChange={(e) =>
                  updateContent("contact", "whatsapp", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
          >
            Save Contact Information
          </button>
        </div>
      )}

      {/* Footer Section */}
      {activeTab === "footer" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Footer Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the information displayed in the website footer.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Footer Description
              </label>

              <textarea
                rows="4"
                value={content.footer.description}
                onChange={(e) =>
                  updateContent("footer", "description", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Copyright Text
              </label>

              <input
                type="text"
                value={content.footer.copyright}
                onChange={(e) =>
                  updateContent("footer", "copyright", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
          >
            Save Footer Content
          </button>
        </div>
      )}

      {/* Backend Note */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        Website content is currently stored locally for development.
        Connect these sections to the backend API when the server is ready.
      </div>
    </div>
  );
}