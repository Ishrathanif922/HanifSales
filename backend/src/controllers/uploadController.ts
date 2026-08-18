import { Response } from "express";
import { IAuthRequest } from "../types";
import { cloudinary } from "../config/cloudinary";
import { sendSuccess, sendError } from "../utils/response";

export const uploadImage = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file uploaded");
      return;
    }

    const folder = (req.query.folder as string) || "hanif-sales/misc";
    const b64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    sendSuccess(res, 200, "Image uploaded", {
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const uploadMultipleImages = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      sendError(res, 400, "No files uploaded");
      return;
    }

    const folder = (req.query.folder as string) || "hanif-sales/misc";
    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map((file) => {
      const b64 = file.buffer.toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataURI, {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });
    });

    const results = await Promise.all(uploadPromises);
    const images = results.map((r) => ({ url: r.secure_url, public_id: r.public_id }));

    sendSuccess(res, 200, "Images uploaded", images);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const deleteImage = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      sendError(res, 400, "public_id is required");
      return;
    }

    await cloudinary.uploader.destroy(publicId);
    sendSuccess(res, 200, "Image deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
