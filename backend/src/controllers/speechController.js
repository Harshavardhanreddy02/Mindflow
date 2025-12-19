import multer from "multer";
import path from "path";

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "audio/webm",
      "audio/mp4",
      "audio/wav",
      "audio/flac",
      "audio/ogg",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid audio format. Supported formats: WebM, MP4, WAV, FLAC, OGG"
        ),
        false
      );
    }
  },
});

export const speechController = {
  /**
   * Transcribe uploaded audio file
   */

  /**
   * Get supported languages
   */
 

  
};

// Middleware to add timing
export const addTiming = (req, res, next) => {
  req.startTime = Date.now();
  next();
};

export { upload };
