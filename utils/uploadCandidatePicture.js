import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const uploadCandidatePicture = async (picture, picturePath) => {
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
  let filePath = `${picturePath}/${picture.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(filePath);
  try {
    await blockBlobClient.uploadData(await picture.arrayBuffer() , {
      blobHTTPHeaders: {
        blobContentType: picture.type,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
  return blockBlobClient.url;
};

export default uploadCandidatePicture;
