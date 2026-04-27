import UserModel from "../models/userModel.js";
import AdminModel from "../models/adminModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


class AuthService {
    static async login(email, password) {
        const user = await UserModel.findByEmail(email);
        if (!user) throw new Error("Invalid Email or Password");

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return null;

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }

    static async loginAdmin(username, password) {
        const admin = await AdminModel.findByUsername(username);
        if (!admin) return null;

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return null;

        const token = jwt.sign(
            { id: admin.id, role: 'admin' }, // Tambahkan role admin di sini
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return { token, admin };

    }
}

export default AuthService