import { API_URL } from "../services/api";

export function readFileAsDataUrl(file) {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please select a valid image file."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export async function handleLocalImageUpload(event, onImageReady) {
  const file = event?.target?.files?.[0];

  if (!file) {
    return null;
  }

  try {
    if (!file.type || !file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload?.message || payload?.error || "Image upload failed.",
      );
    }

    const uploadedUrl =
      payload?.file?.url ||
      payload?.file?.secure_url ||
      payload?.file?.secureUrl ||
      payload?.url ||
      payload?.secureUrl ||
      payload?.secure_url ||
      payload?.data?.url ||
      payload?.data?.secure_url ||
      null;

    if (!uploadedUrl) {
      throw new Error("Image upload did not return a valid URL.");
    }

    if (typeof onImageReady === "function") {
      onImageReady(uploadedUrl);
    }

    if (event?.target) {
      event.target.value = "";
    }

    return uploadedUrl;
  } catch (error) {
    if (event?.target) {
      event.target.value = "";
    }
    throw error;
  }
}
