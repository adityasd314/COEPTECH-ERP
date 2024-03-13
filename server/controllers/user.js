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
        }

        const token = createToken(user);
        delete user.passwordHash;
        res.status(200).json({ ...user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// signup a user
const signupUser = async (req, res) => {
    const { mis, email, password, user_role } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "All fields must be filled" });
    }

    try {
        data = {
            email: email,
            password_hash: await hashPassword(password),
            user_role: "STUDENT",
            mis: mis,
        };
        if (mis) {
            data.mis = mis;
        }
        if (user_role) {
            data.user_role = user_role;
        }

        const user = await client.user.create({ data: data });

        const token = createToken(user);
        delete user.password_hash;
        res.status(200).json({ ...user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, signupUser };
