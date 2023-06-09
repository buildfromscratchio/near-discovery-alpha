import { S3 } from "aws-sdk";
import Compressor from "compressorjs";

const uploadPhoto = async (file, dir, config) => {
  try {
    const compressedFile = await new Promise((resolve) => {
      new Compressor(file, {
        size: 1,
        quality: 0.8,
        ...config,
        success: resolve,
        error: console.log,
      });
    });

    const uploadedImageUrl = await uploader(compressedFile, dir);

    return uploadedImageUrl;
  } catch (err) {
    console.error(err);
  }
};

const uploader = (file, dir) => {
  // console.log(`Uploading Files`, file, dir);

  let fileName =
    (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase() +
    "." +
    file?.name.slice(file?.name.lastIndexOf(".") + 1);
  console.log(`fileName: `, fileName);

  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.S3_BUCKET_REGION,
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: dir ? `${dir}/${fileName}` : fileName,
    Body: file,
    ContentType: file?.type,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

export default uploadPhoto;
