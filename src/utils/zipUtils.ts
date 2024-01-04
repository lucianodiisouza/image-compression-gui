import JSZip from 'jszip'

interface CreateZipProps {
  files: Blob[]
  onProgress: (percentage: number) => void
  originalFileNames: string[]
}

export async function createZip({
  files,
  onProgress,
  originalFileNames,
}: CreateZipProps): Promise<Blob> {
  const zip = new JSZip()
  const totalFiles = files.length

  for (let i = 0; i < totalFiles; i++) {
    const file = files[i]
    const originalFileName = originalFileNames[i]

    try {
      zip.file(originalFileName, file)
      const percentage = ((i + 1) / totalFiles) * 100
      onProgress(percentage)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return zip.generateAsync({ type: 'blob' })
}
