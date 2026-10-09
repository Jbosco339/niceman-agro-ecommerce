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
    const imageDataUrl = await readFileAsDataUrl(file);
    if (typeof onImageReady === "function") {
      onImageReady(imageDataUrl);
    }

    if (event?.target) {
      event.target.value = "";
    }

    return imageDataUrl;
  } catch (error) {
    console.error("Local image upload failed:", error);
    return null;
  }
}
