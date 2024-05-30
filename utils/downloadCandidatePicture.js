import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const downloadCandidatePicture = async (picturePath) => {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const containerName = process.env.AZURE_STORAGE_IMAGE_CONTAINER_NAME;
    if (!accountName || !containerName) {
        throw new Error(
        "Azure Storage Account Name and Container Name must be provided"
        );
    }
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net/`,
        new DefaultAzureCredential()
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let filePath = picturePath.split("/").slice(4).join("/");
    const blockBlobClient = containerClient.getBlockBlobClient(filePath);
    if (!(await blockBlobClient.exists())) {
        
        throw new Error("File does not exist");
    }
    const fileBuffer = await blockBlobClient.downloadToBuffer();
    const fileBase64 = fileBuffer.toString("base64");
    return { base64:fileBase64, name: blockBlobClient.name.split("/").pop()};
}

export default downloadCandidatePicture;