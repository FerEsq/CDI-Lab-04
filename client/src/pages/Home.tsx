import { useDispatch } from 'react-redux';
import { setAppState } from '../store/slices/appState-slice';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';
import Cookies from 'js-cookie';
import { useRef, useState, useEffect } from 'react';
import useFiles from '../hooks/useFiles';
import Header from '../components/Header';
import Swal from 'sweetalert2';

//Definición de colores de la paleta
const colors = {
  primary: '#226946',    //Dartmouth green
  secondary: '#91b4a3',  //Cambridge Blue
  white: '#ffffff',      //White
  dark: '#0d0b0c',       //Night
  accent: '#48284a'      //Violet (JTC)
};

const Home = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sign, setSign] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    handleFileUpload: uploadFileMutation, 
    isUploadLoading, 
    uploadSuccess, 
    resetUploadState 
  } = useFiles();

  const handleLogout = () => {
    dispatch(setAppState('NOT_LOGGED_IN'));
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      uploadFileMutation(selectedFile, sign);
    }
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setSelectedFile(null);
    setSign(false);
    // Reiniciar el input de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Reiniciar el estado de la subida
    resetUploadState();
  };

  // Efecto para mostrar la alerta cuando la subida es exitosa
  useEffect(() => {
    if (uploadSuccess) {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Archivo subido correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: colors.primary
      }).then(() => {
        resetForm();
      });
    }
  }, [uploadSuccess]);

  return (
    <div style={{ 
      backgroundColor: colors.white,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      
      <div style={{
        padding: '30px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '60px' // Espacio para el header fijo
      }}>
        <h1 style={{
          color: colors.primary,
          marginBottom: '30px',
          fontSize: '28px'
        }}>
          Subir Archivo
        </h1>
        
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '8px',
          padding: '30px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.secondary}`
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <label 
              htmlFor="file-upload" 
              style={{
                display: 'block',
                marginBottom: '15px',
                color: colors.dark,
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              Selecciona un archivo:
            </label>
            <div style={{
              border: `1px solid ${colors.secondary}`,
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '20px'
            }}>
              <input 
                id="file-upload"
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{
                  width: '100%'
                }}
              />
            </div>
            {selectedFile && (
              <div style={{
                fontSize: '14px',
                color: colors.primary,
                marginTop: '5px'
              }}>
                Archivo seleccionado: {selectedFile.name}
              </div>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <input 
              id="sign-checkbox"
              type="checkbox" 
              checked={sign}
              onChange={() => setSign(!sign)} 
              style={{
                marginRight: '10px',
                width: '16px',
                height: '16px',
                accentColor: colors.primary
              }}
            />
            <label 
              htmlFor="sign-checkbox"
              style={{
                color: colors.dark
              }}
            >
              Firmar archivo digitalmente
            </label>
          </div>
          
          <button 
            onClick={handleSubmit} 
            disabled={isUploadLoading || !selectedFile}
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: selectedFile ? 'pointer' : 'not-allowed',
              width: '100%',
              opacity: selectedFile ? 1 : 0.7
            }}
          >
            {isUploadLoading ? 'Subiendo...' : 'Subir Archivo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;