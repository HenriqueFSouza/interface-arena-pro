import { api } from "@/lib/api";

interface PresignedUrlResponse {
    url: string;
    publicUrl: string;
}

export class UploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UploadError';
    }
}

export const uploadService = {
    async getPresignedUrl(filename: string): Promise<PresignedUrlResponse> {
        try {
            const response = await api.post<PresignedUrlResponse>('/storage/presigned-url', {
                filename
            });
            return response.data;
        } catch (error) {
            console.error('Error getting presigned URL:', error);
            throw new UploadError('Erro ao obter a URL para upload. Tente novamente.');
        }
    },

    async uploadToS3(url: string, file: File): Promise<void> {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (response.status !== 200) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw new UploadError('Erro ao fazer upload da imagem. Tente novamente.');
        }
    }
}; 