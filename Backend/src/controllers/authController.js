import AuthService from "../services/authService.js";

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }
            const result = await AuthService.login(email, password);

            if (result) {
                res.json({
                    message: "Login successful",
                    token: result.token,
                    user: result.user
                });
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    static async loginAdmin(req, res, next) {
        try {
            const { username, password } = req.body;
            const result = await AuthService.loginAdmin(username, password);

            if (result) {
                res.json({
                    message: "Admin login successful",
                    token: result.token,
                    admin: result.admin
                });
            } else {
                res.status(401).json({ message: "Invalid username or password" });
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

}


export default AuthController;
