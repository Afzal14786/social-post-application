import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config({quiet: true});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder="socail-application", resourceType="image")=> {
    return new Promise((resolve, reject)=> {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: resourceType,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
        }, (error, result)=> {
            if (error) reject(error);
            else resolve(result);
        });

        uploadStream.end(buffer);
    })
}

const deleteFromCloudinary = (publicId, resourceType="image")=> {
    return cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
    })
}

export {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary
}

