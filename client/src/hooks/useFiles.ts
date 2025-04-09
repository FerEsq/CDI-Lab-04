import { useState } from 'react';
import { useUploadFileMutation } from "../store/api/api-slice";

const useFiles = () => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadFile, { isLoading: isUploadLoading }] = useUploadFileMutation();

    const handleFileUpload = async (file: File, sign?: boolean) => {
        setUploadSuccess(false);
        
        const formData = new FormData();
        formData.append('file', file);
        if (sign) {
            formData.append('sign', 'true');
        }
        
        try {
            await uploadFile(formData).unwrap();
            setUploadSuccess(true);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            setUploadSuccess(false);
        }
    };

    const resetUploadState = () => {
        setUploadSuccess(false);
    };

    return {
        handleFileUpload,
        isUploadLoading,
        uploadSuccess,
        resetUploadState
    };
};

export default useFiles;