import { ChangeEvent, useState } from 'react'
import './imagePicker.css'

import { compressImage } from '../utils/imageUtils'
import { createZip } from '../utils/zipUtils'

function ImagePicker() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [isConverting, setIsConverting] = useState<boolean>(false)

  async function handleImageCompression() {
    try {
      setIsConverting(true)

      if (selectedImages.length === 1) {
        await handleSingleImage()
      }

      await handleMultipleImages()
    } catch (error) {
      console.log(error)
    } finally {
      finishWork()
    }
  }

  async function handleSingleImage() {
    const compressedFile = await compressImage({ file: selectedImages[0] })
    createDownloadLink(compressedFile, selectedImages[0].name)
  }

  async function handleMultipleImages() {
    const compressedFiles: Blob[] = []
    const originalFileNames: string[] = selectedImages.map(
      (image) => image.name
    )

    for (const image of selectedImages) {
      const compressedFile = await compressImage({ file: image })
      compressedFiles.push(compressedFile)
    }

    const zipBlob = await createZip({
      files: compressedFiles,
      onProgress: setProgress,
      originalFileNames,
    })
    createDownloadLink(zipBlob, 'compressed_images.zip')
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files as FileList
    const imagesArray: File[] = Array.from(files)

    setSelectedImages(imagesArray)

    const thumbnailsArray: string[] = []
    for (const image of imagesArray) {
      const thumbnail = URL.createObjectURL(image)
      thumbnailsArray.push(thumbnail)
    }
    setThumbnails(thumbnailsArray)
  }

  function createDownloadLink(blob: Blob, filename: string) {
    const downloadLink = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)

    downloadLink.href = objectUrl
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()

    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(downloadLink)
  }

  function finishWork() {
    setIsConverting(false)
    setProgress(0)
    setSelectedImages([])
    setThumbnails([])
  }

  return (
    <div className="container">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e)}
        multiple
      />

      {thumbnails.length > 0 && (
        <div className="thumbnail-container">
          {thumbnails.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`thumbnail-${index}`}
              className="img-thumbnail"
            />
          ))}
        </div>
      )}

      <button
        onClick={handleImageCompression}
        disabled={isConverting || selectedImages.length === 0}
        className="btn-submit"
      >
        Convert
      </button>
      {isConverting && (
        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div
              style={{
                width: `${progress}%`,
              }}
              className="progress-bar"
            ></div>
          </div>
          <div className="progress-counter">{`${Math.round(
            progress
          )}% Complete`}</div>
        </div>
      )}
    </div>
  )
}

export default ImagePicker
