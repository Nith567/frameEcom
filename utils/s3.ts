import{
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
  } from "@aws-sdk/client-s3"

  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  
  const bucketName = "image78bucket";
  
  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: `${process.env.ACCESS_API}`,
      secretAccessKey: `${process.env.SECRET_API}`,
    },
  });
  
 export default function uploadFile(fileBuffer:string, fileName:any, mimetype:any) {
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype,
    };
  
    return s3Client.send(new PutObjectCommand(uploadParams));
  }
  
  function deleteFile(fileName:any) {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileName,
    };
  
    return s3Client.send(new DeleteObjectCommand(deleteParams));
  }
  
  async function getObjectSignedUrl(key:any) {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
  
    try {
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command);
  
      return url;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw error;
    }
  }
  
