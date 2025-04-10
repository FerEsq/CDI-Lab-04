import { useState } from 'react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import { useGetAllFilesQuery } from '../store/api/api-slice';
import useFiles from '../hooks/useFiles';

// Definición de colores de la paleta
const colors = {
  primary: '#226946',    // Dartmouth green
  secondary: '#91b4a3',  // Cambridge Blue
  white: '#ffffff',      // White
  dark: '#0d0b0c',       // Night
  accent: '#48284a'      // Violet (JTC)
};

const Files = () => {
  const { data: files = [], isLoading, error, refetch, isFetching } = useGetAllFilesQuery();
  const { handleFileDownload, isDownloadLoading } = useFiles();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  // Función para actualizar la lista
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Descargar archivo usando el hook useFiles
  const downloadFile = async (fileId: string, filename: string, originalName: string) => {
    try {
      // Mostrar indicador de carga
      Swal.fire({
        title: 'Descargando...',
        text: 'Por favor espera mientras descargamos tu archivo.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Descargar el archivo con su nombre original
      const downloadFilename = originalName || filename;
      
      // Usar el hook para manejar la descarga pasando el nombre del archivo
      const result = await handleFileDownload(fileId, downloadFilename);
      
      if (!result) {
        throw new Error('Error al descargar el archivo');
      }
      
      Swal.close();
      
      // Notificar descarga exitosa
      Swal.fire({
        title: '¡Descarga completada!',
        text: `El archivo ${downloadFilename} se ha descargado correctamente.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: colors.primary
      });
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
    }
  };

  // Determinar si se debe mostrar el estado de carga
  const showLoading = isLoading || isRefreshing || isFetching;

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
          Lista de Archivos
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
              onClick={handleRefresh}
              disabled={showLoading}
              style={{
                backgroundColor: colors.secondary,
                color: colors.dark,
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: showLoading ? 'not-allowed' : 'pointer',
                opacity: showLoading ? 0.7 : 1
              }}
            >
              {showLoading ? 'Actualizando...' : 'Actualizar lista'}
            </button>
          </div>
          
          {showLoading ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ color: colors.primary }}>Cargando archivos...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ color: 'red' }}>Error al cargar los archivos. Por favor, inténtalo de nuevo.</p>
              <button 
                onClick={handleRefresh}
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
                          onClick={() => downloadFile(file._id, file.filename, file.original_name)}
                          disabled={isDownloadLoading}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.white,
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isDownloadLoading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            opacity: isDownloadLoading ? 0.7 : 1
                          }}
                        >
                          {isDownloadLoading ? 'Descargando...' : 'Descargar'}
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