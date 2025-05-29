import Form from "../models/FormModel.js";

export const submitForm = async (req, res) => {
  const userId = req.session.userId;

  const formExist = await Form.findOne({ where: { userId } });
  if (formExist) return res.status(400).json({ message: "Form already submitted" });

  try {
    await Form.create({ ...req.body, userId });
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit form", error: err });
  }
};

export const checkForm = async (req, res) => {
  const userId = req.session.userId;
  const form = await Form.findOne({ where: { userId } });

  if (!form) return res.json({ submitted: false });
  res.json({ submitted: true, data: form });
};
