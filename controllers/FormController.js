import Form from "../models/FormModel.js";
import { encrypt } from "../utils/encryption.js";
import { decrypt } from "../utils/encryption.js";
import bucket from "../config/gcs.js";
import multer from "multer";

// Setup multer
const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("fotoProfil");

// Input Form dengan upload foto
export const submitForm = async (req, res) => {
  const userId = req.session.userId;

  const formExist = await Form.findOne({ where: { userId } });
  if (formExist) return res.status(400).json({ message: "Form already submitted" });

  try {
    let fotoProfilUrl = null;

    // Jika user upload file
    if (req.file) {
      const blob = bucket.file(Date.now() + "_" + req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", reject);
        blobStream.on("finish", resolve);
        blobStream.end(req.file.buffer);
      });

      fotoProfilUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    }

    const formData = {
      ...req.body,
      nik: encrypt(req.body.nik),
      userId,
      fotoProfil: fotoProfilUrl,
    };

    await Form.create(formData);
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit form", error: err.message });
  }
};


//Validation Form
export const checkForm = async (req, res) => {
  const userId = req.session.userId;
  const form = await Form.findOne({ where: { userId } });

  if (!form) return res.json({ submitted: false });

  const formData = {
    ...form.dataValues,
    nik: decrypt(form.nik)
  };

  res.json({ submitted: true, data: formData });
};

// Update form (edit data & opsional ganti foto)
export const editForm = async (req, res) => {
  const userId = req.session.userId;

  const form = await Form.findOne({ where: { userId } });
  if (!form) return res.status(404).json({ message: "Form not found" });

  try {
    let fotoProfilUrl = form.fotoProfil;

    if (req.file) {
      const blob = bucket.file(Date.now() + "_" + req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", reject);
        blobStream.on("finish", resolve);
        blobStream.end(req.file.buffer);
      });

      fotoProfilUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    }

    await form.update({
      ...req.body,
      nik: encrypt(req.body.nik),
      fotoProfil: fotoProfilUrl,
    });

    res.json({ message: "Form updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update form", error: err.message });
  }
};
