import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';
import { setAppState } from '../store/slices/appState-slice';

// Definición de colores de la paleta
const colors = {
  primary: '#226946',    // Dartmouth green
  secondary: '#91b4a3',  // Cambridge Blue
  white: '#ffffff',      // White
  dark: '#0d0b0c',       // Night
  accent: '#48284a'      // Violet (JTC)
};

const Verify = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isVerified: boolean;
    message: string;
  } | null>(null);

  const handleLogout = () => {
    dispatch(setAppState('NOT_LOGGED_IN'));
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Reset previous verification results when a new file is selected
      setVerificationResult(null);
    }
  };

  const handleVerify = async () => {
    if (!selectedFile) return;

    setIsVerifying(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = Cookies.get(TOKEN_COOKIE_NAME);
      
      const response = await fetch('http://localhost:3000/api/files/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      // Manejo de los 3 casos de respuesta posibles
      if (data.is_valid === true) {
        // Caso 1: La firma es válida
        setVerificationResult({
          isVerified: true,
          message: data.message || 'La firma del archivo ha sido verificada correctamente'
        });
      } else if (data.is_valid === false) {
        // Caso 3: La firma es inválida
        setVerificationResult({
          isVerified: false,
          message: data.message || 'La firma del archivo es inválida'
        });
      } else if (data.error) {
        // Caso 2: El archivo no está firmado
        setVerificationResult({
          isVerified: false,
          message: data.error || 'El archivo no está firmado'
        });
      } else {
        // Caso de error general
        setVerificationResult({
          isVerified: false,
          message: 'No se pudo verificar la firma del archivo'
        });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationResult({
        isVerified: false,
        message: 'Ocurrió un error durante la verificación'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    setSelectedFile(null);
    setVerificationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Efecto para mostrar la alerta cuando se completa la verificación
  useEffect(() => {
    if (verificationResult) {
      let iconType: 'success' | 'error' | 'warning' = verificationResult.isVerified ? 'success' : 'error';
      let alertTitle = verificationResult.isVerified ? '¡Verificado!' : 'No Verificado';
      
      // Si el mensaje contiene "no está firmado", cambiamos el icono a warning
      if (verificationResult.message.includes('no está firmado')) {
        iconType = 'warning';
        alertTitle = 'Archivo Sin Firma';
      }
      
      Swal.fire({
        title: alertTitle,
        text: verificationResult.message,
        icon: iconType,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: colors.primary
      }).then(() => {
        if (verificationResult.isVerified) {
          resetForm();
        }
      });
    }
  }, [verificationResult]);

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
          Verificar Firma Digital
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
            marginBottom: '30px'
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
              Selecciona un archivo para verificar:
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
            flexDirection: 'column',
            gap: '15px'
          }}>
            <button 
              onClick={handleVerify} 
              disabled={isVerifying || !selectedFile}
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
              {isVerifying ? 'Verificando...' : 'Verificar Firma'}
            </button>
            
            <button 
              onClick={resetForm} 
              style={{
                backgroundColor: colors.white,
                color: colors.primary,
                padding: '12px 20px',
                border: `1px solid ${colors.primary}`,
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;