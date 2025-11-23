import httpClient from "@/lib/httpClient";

export interface AssetUploadResponse {
  url: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

export async function uploadAsset(file: File): Promise<AssetUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await httpClient.post<AssetUploadResponse>("/assets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
