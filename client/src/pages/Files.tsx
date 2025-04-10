import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';
import { setAppState } from '../store/slices/appState-slice';

// Definición de colores de la paleta (igual que en Home.tsx)
const colors = {
  primary: '#226946',    // Dartmouth green
  secondary: '#91b4a3',  // Cambridge Blue
  white: '#ffffff',      // White
  dark: '#0d0b0c',       // Night
  accent: '#48284a'      // Violet (JTC)
};

// Definición del tipo de archivo completo
interface FileItem {
  _id: string;
  filename: string;
  created_at: string;
  original_name: string;
  is_signed: boolean;
  mime_type: string;
  owner_id: string;
  signature: string | null;
  signed_at?: string;
  size: number;
}

const Files = () => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    dispatch(setAppState('NOT_LOGGED_IN'));
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  };

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  // Mostrar alerta de sesión expirada
  const handleSessionExpired = () => {
    Swal.fire({
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: colors.primary
    }).then(() => {
      handleLogout();
    });
  };

  // Obtener la lista de archivos del endpoint file list
  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      
      if (!token) {
        dispatch(setAppState('NOT_LOGGED_IN'));
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/files/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setFiles(response.data);
      } else {
        setError('Formato de respuesta inesperado. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error al obtener los archivos:', err);
      setError('Error al cargar los archivos. Por favor, inténtalo de nuevo.');
      
      // Si es un error de autenticación, desconectar al usuario
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleSessionExpired();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Descargar archivo usando el endpoint download
  const downloadFile = async (fileId: string, filename: string, isSigned: boolean) => {
    try {
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      
      if (!token) {
        dispatch(setAppState('NOT_LOGGED_IN'));
        return;
      }
      
      // Mostrar indicador de carga
      Swal.fire({
        title: 'Descargando...',
        text: 'Por favor espera mientras descargamos tu archivo.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Realizar la descarga
      const response = await axios.get(`http://localhost:3000/api/files/${fileId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Eliminar el enlace
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      Swal.close();
      
      // Mensaje según si el archivo está firmado o no
      if (isSigned) {
        Swal.fire({
          title: '¡Descarga completada!',
          html: `
            <p>El archivo <strong>${filename}</strong> se ha descargado correctamente.</p>
            <p>Este archivo está firmado digitalmente.</p>
            <p>La descarga incluye tanto el archivo como la llave pública del usuario que lo guardó.</p>
          `,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: colors.primary
        });
      } else {
        Swal.fire({
          title: '¡Descarga completada!',
          html: `
            <p>El archivo <strong>${filename}</strong> se ha descargado correctamente.</p>
            <p>Este archivo no está firmado digitalmente.</p>
          `,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: colors.primary
        });
      }
    } catch (err) {
      console.error('Error al descargar el archivo:', err);
      
      Swal.close();
      
      // Mostrar mensaje de error
      Swal.fire({
        title: 'Error',
        text: 'Error al descargar el archivo. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: colors.primary
      });
      
      // Si es un error de autenticación, desconectar al usuario
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleSessionExpired();
      }
    }
  };

  // Cargar los archivos al montar el componente
  useEffect(() => {
    fetchFiles();
  }, []);

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
          Mis Archivos
        </h1>
        
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '8px',
          padding: '30px',
          width: '100%',
          maxWidth: '900px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.secondary}`
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <button 
              onClick={fetchFiles}
              style={{
                backgroundColor: colors.secondary,
                color: colors.dark,
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Actualizar lista
            </button>
          </div>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ color: colors.primary }}>Cargando archivos...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ color: 'red' }}>{error}</p>
              <button 
                onClick={fetchFiles}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '15px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Reintentar
              </button>
            </div>
          ) : files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ color: colors.dark }}>No tienes archivos guardados.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse' 
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: colors.primary,
                    color: colors.white
                  }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Nombre del archivo</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Fecha de creación</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Tamaño</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Firmado</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file._id} style={{ 
                      borderBottom: `1px solid ${colors.secondary}`,
                      transition: 'background-color 0.3s'
                    }}>
                      <td style={{ padding: '12px' }}>{file.filename}</td>
                      <td style={{ padding: '12px' }}>
                        {file.created_at}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {formatFileSize(file.size)}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {file.is_signed ? (
                          <span style={{ color: colors.primary }}>✓ Sí</span>
                        ) : (
                            <span style={{ color: "#d92424" }}>✗ No</span>
                        )}
                      </td>
                      <td style={{ 
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <button 
                          onClick={() => downloadFile(file._id, file.filename, file.is_signed)}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.white,
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Descargar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;