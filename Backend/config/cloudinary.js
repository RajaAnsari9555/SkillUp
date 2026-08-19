import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

const uploadOnCloudinary = async (filePath, options = {}) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!filePath) {
            return null;
        }

        // Determine file extension
        const ext = filePath.split('.').pop().toLowerCase();
        
        console.log(`📤 Uploading file: ${filePath} (extension: ${ext})`);

        // Upload ALL file types as 'auto' to let Cloudinary decide
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto', // Let Cloudinary auto-detect
            type: 'upload',
            folder: 'skillup-notes', // Organize in a folder
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            ...options
        });

        // Delete local file after successful upload
        fs.unlinkSync(filePath);

        console.log("✅ File uploaded to Cloudinary");
        console.log("🔗 URL:", uploadResult.secure_url);
        console.log("📊 Public ID:", uploadResult.public_id);
        console.log("📦 Resource type:", uploadResult.resource_type);
        console.log("🔓 Access mode:", uploadResult.access_mode || 'public (default)');
        
        return uploadResult.secure_url;
    } catch (error) {
        // Clean up local file on error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error("❌ Cloudinary upload error:", error);
        return null;
    }
};

export default uploadOnCloudinary
