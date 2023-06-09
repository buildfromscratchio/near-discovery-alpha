import { S3 } from "aws-sdk";

const deletePhoto = (url) => {
  const objectKey = url.split("/").slice(4).join("/");

  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.S3_BUCKET_REGION,
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: objectKey,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export default deletePhoto;
