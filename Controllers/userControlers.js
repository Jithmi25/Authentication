import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/user.js";
import nodemailer from "nodemailer";

dotenv.config();

// register user
export async function createUser(req, res) {
    try {
        const { email, userName, password, confirmPassword } = req.body;

        if (!email || !userName || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            userName,
            password: hashedPassword,
        });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully." });
    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        return res.status(500).json({ message: "Error creating user", error: err.message });
    }
}

// Login user
export async function LoginUser(req, res) {
    try {
        const { emailOrUserName, password } = req.body;

        
        if (!emailOrUserName || !password) {
            return res.status(400).json({ message: "Email/Username and password are required." });
        }
         
        const foundUser = await User.findOne({
            $or: [{ email: emailOrUserName }, { userName: emailOrUserName }]
        });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const token = jwt.sign(
            {
                email: foundUser.email,
                userName: foundUser.userName,
                isBlocked: foundUser.isBlocked,
                type: foundUser.type,
                profilePic: foundUser.profilePic || "",
            },
            process.env.SECRET || "defaultsecret", 
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error." });
    }
}


//forgot-password
export async function ForgotPassword (req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET1, { expiresIn: '1h' });
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; 
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        //const resetUrl = `http://localhost:5000/reset-password?token=${resetToken}`;
        const resetUrl = `#`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });

        res.status(200).json({ message: 'Password reset email sent' });
    }catch (error) {
        console.error('Error in ForgotPassword:', error); 
        res.status(500).json({ message: 'Internal server error', error: error.message || error });
    }
    
}
//reset-password
export async function ResetPassword (req, res){
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET1);

        const user = await User.findOne({
            _id: decoded.userId,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    }catch (error) {
            console.error('Error in ForgotPassword:', error); 
            res.status(500).json({ message: 'Internal server error', error: error.message || error });
        }
}

