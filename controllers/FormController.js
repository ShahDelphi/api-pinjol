import Form from "../models/FormModel.js";
import { encrypt } from "../utils/encryption.js";
import { decrypt } from "../utils/encryption.js";

//Input Form
export const submitForm = async (req, res) => {
  const userId = req.session.userId;

  const formExist = await Form.findOne({ where: { userId } });
  if (formExist) return res.status(400).json({ message: "Form already submitted" });

  try {
    const formData = {
      ...req.body,
      nik: encrypt(req.body.nik),
      userId
    };

    await Form.create(formData);
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit form", error: err });
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
