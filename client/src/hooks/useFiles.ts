import { useState } from 'react';
import { useUploadFileMutation, useVerifyFileMutation } from "../store/api/api-slice";

const useFiles = () => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [uploadFile, { isLoading: isUploadLoading }] = useUploadFileMutation();
    const [verifyFile, { isLoading: isVerifyLoading, error: verifyError }] = useVerifyFileMutation();

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

    const handleFileVerification = async (file: File) => {
        setVerificationSuccess(false);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await verifyFile(formData).unwrap();
            setVerificationSuccess(true);
            return response;
        } catch (error) {
            console.error('Error al verificar el archivo:', error);
            setVerificationSuccess(false);
        }
    };


    const resetUploadState = () => {
        setUploadSuccess(false);
    };

    return {
        handleFileUpload,
        isUploadLoading,
        uploadSuccess,
        resetUploadState,
        handleFileVerification,
        isVerifyLoading,
        verificationSuccess,
        verifyError
    };
};

export default useFiles;