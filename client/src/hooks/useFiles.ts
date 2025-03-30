import { useUploadFileMutation } from "../store/api/api-slice";

const useFiles = () => {
    const [uploadFile, { isLoading: isUploadLoading }] = useUploadFileMutation();

    const handleFileUpload = (file: File, sign?: boolean) => {
        const formData = new FormData();
        formData.append('file', file);
        if (sign) {
            formData.append('sign', 'true');
        }
        uploadFile(formData);
    };

    return {
        handleFileUpload,
        isUploadLoading
    };
};

export default useFiles;