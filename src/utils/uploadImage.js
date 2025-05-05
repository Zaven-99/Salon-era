import imageCompression from "browser-image-compression";

/**
 * Сжимает изображение и возвращает сжатый файл и dataURL
 * @param {Event} event - Событие от <input type="file" />
 * @param {Object} optionsOverride - Настройки сжатия (необязательные)
 * @param {Function} setLoading - Функция для управления состоянием загрузки
 * @returns {Promise<{ compressedFile: File, dataUrl: string } | null>}
 */
export const compressAndPreviewImage = async (
  event,
  optionsOverride = {},
  setLoading
) => {
  setLoading(true); // Показываем спиннер перед началом сжатия

  const file = event?.target?.files?.[0];
  if (!file || !file.type.startsWith("image/")) {
    alert("Выберите корректный файл изображения.");
    setLoading(false); // Прячем спиннер, если файл не подходит
    return null;
  }

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: file.type,
    ...optionsOverride,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });

    return { compressedFile, dataUrl };
  } catch (error) {
    console.error("Ошибка при сжатии изображения:", error);
    return null;
  } finally {
    setLoading(false); // Прячем спиннер после завершения сжатия
  }
};


 