import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        // Debug logging
        console.log("🍪 Cookies received:", req.cookies);
        console.log("🔑 Headers:", req.headers.cookie);
        
        const { token } = req.cookies;
        
        if (!token) {
            console.log("❌ No token found in cookies");
            return res.status(401).json({ 
                message: "Authentication required. Please login to continue." 
            });
        }

        console.log("✅ Token found, verifying...");
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!verifyToken || !verifyToken.userId) {
            console.log("❌ Token verification failed");
            return res.status(401).json({ 
                message: "Invalid or expired token. Please login again." 
            });
        }

        console.log("✅ Token verified for user:", verifyToken.userId);
        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        console.log("❌ Auth error:", error.name, error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: "Invalid token. Please login again." 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: "Token expired. Please login again." 
            });
        }
        return res.status(500).json({ 
            message: `Authentication error: ${error.message}` 
        });
    }
}
 
export default isAuth