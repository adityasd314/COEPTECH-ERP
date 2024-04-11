const { eq, lt, gte, ne } = require('drizzle-orm');
const jwt = require("jsonwebtoken");
const PrismaClient = require("../lib/prisma-client");
const DrizzleClient = require("../lib/drizzle-client")
const client = require("../lib/prisma-client");
const hashPassword = require("../lib/hash_pass");
const compareHash = require("../lib/compare_hash");
const {roles,users} = require("../db/schema")

const { use } = require("../routes/user");
const createToken = (user) => {
    return jwt.sign({ user }, "secret", { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
    
    const { email, password } = req.body;
    
    
    if (!email || !password) {
        res.status(400).json({ error: "All fields must be filled" });
        return;
    }
    
    try {

        const user = (await DrizzleClient.select().from(users).where(eq(users.email, email)))[0];
        if (!user) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }

        const isMatch = await compareHash(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }

        const token = createToken(user);
        delete user.passwordHash;
        res.status(200).json({ ...user, token });
        return;
    } catch (error) {
        res.status(400).json({ error: error.message });
        return;
    }
};

// signup a user
const signupUser = async (req, res) => {
    const { mis, email, password, user_role:role } = req.body;
    // 'admin', 'teacher', 'student'
    if (!email || !password &&  !role) {
        res.status(400).json({ error: "All fields must be filled" });
    }

    try {
        data = {
            email: email,
            role: role || "student",
            passwordHash: await hashPassword(password),
        };
        console.log({data})
        if (mis) {
            data.mis = mis;
        }
       
        const user = (await DrizzleClient.insert(users).values(data).execute())[0];
        const token = createToken(user);
    res.status(200).json({ ...user, token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, signupUser };
