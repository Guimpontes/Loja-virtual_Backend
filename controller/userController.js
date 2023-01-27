const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { registrationSchema, loginSchema, updateDataSchema, changePasswordSchema } = require("./validation")


const registration = async (req, res) => {
    const { name, email, password } = req.body;


    // Data validations
    const { error } = registrationSchema.validate(req.body);
    if (error) return res.status(401).json({ msg: "", error: error.message });

    // Password encrypted 
    const passwordEncrypted = await bcrypt.hash(password, 8);

    // User already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.json({ msg: "", error: "User already exists" });

    // Registring user 
    const user = new User({
        name,
        email,
        password: passwordEncrypted,
    })

    try {
        const savedUser = user.save();
        res.status(201).json({ msg: "User created successfully" })
    } catch (error) {
        res.json({ error: error })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(401).json({ msg: "", error: error.message })

    // User exists
    const userExists = await User.findOne({ email });
    if (!userExists) return res.status(401).json({ msg: "", error: "Email or password incorrect" })

    // Compare password
    const passwordCompare = await bcrypt.compare(password, userExists.password);
    if (!passwordCompare) return res.status(401).json({ msg: "", error: "Email or password incorrect" })

    // Login user
    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRETE);

    try {
        res.status(200).json({ msg: "User logged", token: token, user: { name: userExists.name, email: userExists.email }, error: "" })
    } catch (error) {
        res.json({ error: error })
    }
}

const updateUserData = async (req, res) => {
    const { name, email, current_password } = req.body;
    const userId = req.user.id;

    // Validate data
    const { error } = updateDataSchema.validate(req.body);
    if (error) return res.status(401).json({ msg: "", error: error.message });

    const user = await User.findOne({ _id: userId });

    // Data not changed
    if (user.name === name && user.email === email) {
        return res.status(401).json({ msg: "", error: "No data has been changed" })
    }

    // Compare email
    if (email != user.email) {
        // Email alredy registed
        const userExists = await User.findOne({ email })
        if (userExists) return res.status(401).json({ msg: "", error: "Email already registered" })
    }

    // Validate password
    const comparePassword = await bcrypt.compare(current_password, user.password);
    if (!comparePassword) return res.status(401).json({ msg: "", error: "Current password incorrect" });

    try {
        const newData = await User.updateOne({ _id: userId }, { $set: { "name": name, "email": email, "updateAt": Date.now() } });
        res.status(201).json({ msg: "User updated successfully", user: { name, email } });
    } catch (error) {
        res.json({ msg: "", error: error })
    }
}

const changePassword = async (req, res) => {
    const { current_password, new_password, confirm_new_password } = req.body;
    const userId = req.user.id;

    // Validate
    const { error } = changePasswordSchema.validate(req.body);
    if (error) return res.status(401).json({ msg: "", error: error.message });

    const user = await User.findOne({ _id: userId });

    // Validate current_password
    const comparePassword = await bcrypt.compare(current_password, user.password);
    if (!comparePassword) return res.status(401).json({ msg: "", error: "Current password incorrect" });

    // New_password equal current_password
    if (new_password === current_password) {
        return res.status(401).json({ msg: "", error: "New password cannot be the same as current password" })
    }

    // Encrypt new_password
    const encryptedNewPassword = await bcrypt.hash(new_password, 8);

    try {
        const savedNewPassword = await User.updateOne({ _id: userId }, { $set: { "password": encryptedNewPassword, "updateAt": Date.now() } });
        res.status(201).json({ msg: "Password changed successfully ", error: "" })
    } catch (error) {
        res.json(error)
    }
}

const deleteUser = async (req, res) => {
    const { password, email } = req.body;
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId })

    // Compare email
    if (email != user.email) return res.status(401).json({ msg: "", error: "invalid Data" })

    // Compare password 
    const comparePasword = await bcrypt.compare(password, user.password)
    if (!comparePasword) return res.status(401).json({ msg: "", error: "invalid Data" });

    try {
        const deleteUser = await User.deleteOne({ _id: userId, email });
        res.status(200).json({ msg: "successfully deleted account", error: "" });
    } catch (error) {
        res.json(error)
    }
}

module.exports = { registration, login, updateUserData, changePassword, deleteUser };