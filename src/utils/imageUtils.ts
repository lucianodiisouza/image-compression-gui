import imageCompression from 'browser-image-compression'

interface CompressImageProps {
  file: File
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export async function compressImage({
  file,
  maxSizeMB = 1,
  maxWidthOrHeight = 1920,
}: CompressImageProps): Promise<Blob> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.log(error)
    throw error
  }
}
