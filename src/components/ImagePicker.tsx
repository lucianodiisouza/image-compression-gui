import React, { ChangeEvent, useState } from 'react'
import './imagePicker.css'
import { compressImage } from '../utils/imageUtils'
import { createZip } from '../utils/zipUtils'

function ImagePicker() {
  const [maxImageSize, setMaxImageSize] = useState<number>(1)
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number>(1920)

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

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
    const compressedFile = await compressImage({
      file: selectedImages[0],
      maxSizeMB: maxImageSize,
      maxWidthOrHeight: maxWidthOrHeight,
    })
    createDownloadLink(compressedFile, selectedImages[0].name)
  }

  async function handleMultipleImages() {
    const compressedFiles: Blob[] = []
    const originalFileNames: string[] = selectedImages.map(
      (image) => image.name
    )

    for (const image of selectedImages) {
      const compressedFile = await compressImage({
        file: image,
        maxSizeMB: maxImageSize,
        maxWidthOrHeight: maxWidthOrHeight,
      })
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
    handleFiles(files)
  }

  function handleFiles(files: FileList) {
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

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    handleFiles(files)
  }

  function handleRemoveImage(index: number) {
    const updatedImages = [...selectedImages]
    const updatedThumbnails = [...thumbnails]

    updatedImages.splice(index, 1)
    updatedThumbnails.splice(index, 1)

    setSelectedImages(updatedImages)
    setThumbnails(updatedThumbnails)
  }

  return (
    <div
      className="container"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="properties-container">
        <div className="input-row">
          <label htmlFor="maxImageSize">
            Max. image size in MegaBytes (Recommended 1mb).
          </label>
          <input
            type="number"
            id="maxImageSize"
            value={maxImageSize}
            onChange={(e) => setMaxImageSize(Number(e.target.value))}
            placeholder="Max. image size"
          />
        </div>
        <div className="input-row">
          <label htmlFor="maxImageSize">
            Max. image width/height in Pixels (Recommended 1920px).
          </label>
          <input
            type="number"
            value={maxWidthOrHeight}
            onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
            placeholder="Max. width/height"
          />
        </div>
      </div>
      <label
        htmlFor="imagePicker"
        className={`picker-label ${isDragging ? 'drag-over' : ''}`}
      >
        Click to pick your images or drop them here
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e)}
        multiple
        style={{ display: 'none' }}
        id="imagePicker"
      />

      {thumbnails.length > 0 && (
        <div className="thumbnail-container">
          {thumbnails.map((thumbnail, index) => (
            <div key={index} className="thumbnail-item">
              <img
                src={thumbnail}
                alt={`thumbnail-${index}`}
                className="img-thumbnail"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="remove-button"
                title="Delete item"
              >
                &#x2716; {/* Unicode character for 'X' */}
              </button>
            </div>
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
