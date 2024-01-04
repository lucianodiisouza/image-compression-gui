import ImagePicker from './components/ImagePicker'

function App() {
  return (
    <>
      <h1>Image Compression GUI</h1>
      <span>
        🇺🇸 This is a GUI implementation of{' '}
        <code>browser-image-compression npmjs library</code>
        <p>click input to choose image files.</p>
      </span>
      <span>
        🇧🇷 Esta é uma implementação gráfica da lib{' '}
        <code>browser-image-compression</code>
        <p>Clique no input para escolher as imagens.</p>
      </span>
      <ImagePicker />
    </>
  )
}

export default App
