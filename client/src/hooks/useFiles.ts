import { useState } from 'react';
import { 
  useUploadFileMutation, 
  useVerifyFileMutation,
  useLazyGetFileDataQuery,
  useDownloadFileMutation,
  FileItem
} from "../store/api/api-slice";

const useFiles = () => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const [fileData, setFileData] = useState<FileItem | null>(null);
    
    const [uploadFile, { isLoading: isUploadLoading }] = useUploadFileMutation();
    const [verifyFile, { isLoading: isVerifyLoading, error: verifyError }] = useVerifyFileMutation();
    const [downloadFile, { isLoading: isDownloadLoading }] = useDownloadFileMutation();
    const [getFileData, { isLoading: isFileDataLoading }] = useLazyGetFileDataQuery();

    const handleFileUpload = async (file: File, sign?: boolean) => {
        setUploadSuccess(false);
        
        const formData = new FormData();
        formData.append('file', file);
        if (sign) {
            formData.append('sign', 'true');
        }
        
        try {
            const result = await uploadFile(formData);
            if ('data' in result) {
                setUploadSuccess(true);
                return result.data;
            } else {
                console.error('Error al subir el archivo:', result.error);
                setUploadSuccess(false);
                return null;
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            setUploadSuccess(false);
            return null;
        }
    };

    const handleFileVerification = async (file: File) => {
        setVerificationSuccess(false);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await verifyFile(formData);
            if ('data' in result) {
                setVerificationSuccess(true);
                return result.data;
            } else {
                console.error('Error al verificar el archivo:', result.error);
                setVerificationSuccess(false);
                return null;
            }
        } catch (error) {
            console.error('Error al verificar el archivo:', error);
            setVerificationSuccess(false);
            return null;
        }
    };

    const handleFileDownload = async (fileId: string) => {
        setDownloadSuccess(false);
        
        try {
            console.log('Iniciando descarga del archivo con ID:', fileId);
            const result = await downloadFile(fileId);
            
            if ('data' in result) {
                console.log('Descarga exitosa, tipo de blob:', result.data.type, 'tamaño:', result.data.size);
                
                // Crear un objeto URL para el blob recibido
                const blob = result.data;
                const url = window.URL.createObjectURL(blob);
                
                // Obtener el nombre del archivo de la respuesta HTTP si está disponible
                const contentDisposition = result.meta?.response?.headers.get('content-disposition');
                let filename = `file-${fileId}`;
                
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1].replace(/['"]/g, '');
                    }
                }
                
                // Crear un elemento ancla temporal para descargar el archivo
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                
                // Limpieza
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                setDownloadSuccess(true);
                return result.data;
            } else {
                console.error('Error al descargar el archivo:', result.error);
                setDownloadSuccess(false);
                return null;
            }
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
            setDownloadSuccess(false);
            return null;
        }
    };

    const fetchFileData = async (fileId: string) => {
        setFileData(null);
        
        try {
            const result = await getFileData(fileId);
            
            if ('data' in result) {
                setFileData(result.data);
                return result.data;
            } else {
                console.error('Error al obtener datos del archivo:', result.error);
                return null;
            }
        } catch (error) {
            console.error('Error al obtener datos del archivo:', error);
            return null;
        }
    };

    const resetStates = () => {
        setUploadSuccess(false);
        setVerificationSuccess(false);
        setDownloadSuccess(false);
        setFileData(null);
    };

    return {
        // Métodos de carga y verificación existentes
        handleFileUpload,
        isUploadLoading,
        uploadSuccess,
        handleFileVerification,
        isVerifyLoading,
        verificationSuccess,
        verifyError,
        
        // Nuevos métodos para descarga y datos de archivos
        handleFileDownload,
        isDownloadLoading,
        downloadSuccess,
        fetchFileData,
        isFileDataLoading,
        fileData,
        
        // Método para reiniciar todos los estados
        resetStates
    };
};

export default useFiles;