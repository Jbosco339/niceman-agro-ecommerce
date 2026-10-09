import { useState } from "react";
import useWebsiteContent from "../../../hooks/useWebsiteContent";
import { handleLocalImageUpload } from "../../../utils/localImageUpload";

export default function WebsiteContent() {
  const [activeTab, setActiveTab] = useState("hero");
  const [heroBannerPreview, setHeroBannerPreview] = useState("");
  const [heroBannerPreview2, setHeroBannerPreview2] = useState("");

  const { content, updateSection } = useWebsiteContent();

  const updateContent = (section, field, value) => {
    updateSection(section, { [field]: value });
  };

  const updateHeroSlide = (index, field, value) => {
    const slides =
      content.hero && content.hero.slides ? [...content.hero.slides] : [];
    // Ensure at least two slots
    while (slides.length < 2)
      slides.push({
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        image: "",
      });
    slides[index] = { ...(slides[index] || {}), [field]: value };

    if (index === 0) {
      // keep top-level hero keys in sync for backwards compatibility
      updateSection("hero", { slides, [field]: value });
    } else {
      updateSection("hero", { slides });
    }
  };

  const handleHeroImageUpload = async (index, e) => {
    const dataUrl = await handleLocalImageUpload(e, (nextImage) => {
      updateHeroSlide(index, "image", nextImage);
      if (index === 0) setHeroBannerPreview(nextImage);
      if (index === 1) setHeroBannerPreview2(nextImage);
    });

    const slide = content.hero?.slides?.[index];
    if (!dataUrl && slide?.image) {
      if (index === 0) setHeroBannerPreview(slide.image);
      if (index === 1) setHeroBannerPreview2(slide.image);
    }
  };

  const handleSave = (section) => {
    // content is already persisted via the provider
    alert(
      `${section.charAt(0).toUpperCase() + section.slice(1)} content saved successfully.`,
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the content displayed across your website.
        </p>
      </div>

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

          <div className="space-y-6">
            {/* Slide 1 editor */}
            <div className="rounded-lg border border-gray-100 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Hero Slide 1 (keeps current site values)
              </h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={
                      content?.hero?.slides?.[0]?.title ||
                      content?.hero?.title ||
                      ""
                    }
                    onChange={(e) =>
                      updateHeroSlide(0, "title", e.target.value)
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
                    value={
                      content?.hero?.slides?.[0]?.buttonText ||
                      content?.hero?.buttonText ||
                      ""
                    }
                    onChange={(e) =>
                      updateHeroSlide(0, "buttonText", e.target.value)
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
                    value={
                      content?.hero?.slides?.[0]?.subtitle ||
                      content?.hero?.subtitle ||
                      ""
                    }
                    onChange={(e) =>
                      updateHeroSlide(0, "subtitle", e.target.value)
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
                    value={
                      content?.hero?.slides?.[0]?.buttonLink ||
                      content?.hero?.buttonLink ||
                      ""
                    }
                    onChange={(e) =>
                      updateHeroSlide(0, "buttonLink", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hero Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHeroImageUpload(0, e)}
                    className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload or replace Slide 1 image.
                  </p>

                  {(heroBannerPreview ||
                    content?.hero?.slides?.[0]?.image ||
                    content?.hero?.image) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </p>
                      <img
                        src={
                          heroBannerPreview ||
                          content?.hero?.slides?.[0]?.image ||
                          content?.hero?.image
                        }
                        alt="Hero slide 1 preview"
                        className="w-full h-48 rounded-lg object-cover border border-gray-200 bg-gray-50"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleSave("hero")}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  Save Slide 1
                </button>
              </div>
            </div>

            {/* Slide 2 editor */}
            <div className="rounded-lg border border-gray-100 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Hero Slide 2
              </h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={content?.hero?.slides?.[1]?.title || ""}
                    onChange={(e) =>
                      updateHeroSlide(1, "title", e.target.value)
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
                    value={content?.hero?.slides?.[1]?.buttonText || ""}
                    onChange={(e) =>
                      updateHeroSlide(1, "buttonText", e.target.value)
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
                    value={content?.hero?.slides?.[1]?.subtitle || ""}
                    onChange={(e) =>
                      updateHeroSlide(1, "subtitle", e.target.value)
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
                    value={content?.hero?.slides?.[1]?.buttonLink || ""}
                    onChange={(e) =>
                      updateHeroSlide(1, "buttonLink", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hero Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHeroImageUpload(1, e)}
                    className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload image for Slide 2.
                  </p>

                  {(heroBannerPreview2 ||
                    content?.hero?.slides?.[1]?.image) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </p>
                      <img
                        src={
                          heroBannerPreview2 ||
                          content?.hero?.slides?.[1]?.image
                        }
                        alt="Hero slide 2 preview"
                        className="w-full h-48 rounded-lg object-cover border border-gray-200 bg-gray-50"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleSave("hero")}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  Save Slide 2
                </button>
              </div>
            </div>
          </div>
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
            onClick={() => handleSave("about")}
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
            onClick={() => handleSave("contact")}
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
            onClick={() => handleSave("footer")}
            className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
          >
            Save Footer Content
          </button>
        </div>
      )}

      {/* Backend Note */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        Website content is currently stored locally for development. Connect
        these sections to the backend API when the server is ready.
      </div>
    </div>
  );
}
