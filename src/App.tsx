import ImagePicker from './components/ImagePicker'

function App() {
  return (
    <>
      <h1>Image Compression GUI</h1>
      <span style={{ lineHeight: 0.8 }}>
        🇺🇸 This is a GUI implementation of{' '}
        <code>browser-image-compression npmjs library</code>
        <p>
          Click input to choose image files. <br />
        </p>
        <p>
          the max width/height param will infer this number to use on the
          largest size of the image.
        </p>
      </span>
      <hr />
      <span style={{ lineHeight: 0.8 }}>
        🇧🇷 Esta é uma implementação gráfica da lib{' '}
        <code>browser-image-compression</code>
        <p>Clique no input para escolher as imagens.</p>
        <p>
          O parâmetro largura/altura máxima inferirá esse número para usar no
          maior tamanho da imagem.
        </p>
      </span>
      <ImagePicker />
    </>
  )
}

export default App
