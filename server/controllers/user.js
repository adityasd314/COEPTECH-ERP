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
    const { mis, email, password, user_role } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "All fields must be filled" });
    }

    try {
        data = {
            email: email,
            passwordHash: await hashPassword(password),
            mis: mis,
        };
        
        if (mis) {
            data.mis = mis;
        }
        if (user_role) {
            data.user_role = user_role;
        }
        const roleId = ((await DrizzleClient.select({roleId: roles.roleId}).from(roles).where(eq(roles.roleName, user_role)))[0]).roleId;
        data.roleId = roleId;   
        const user = (await DrizzleClient.insert(users).values(data).returning({ email:users.email, mis:users.mis, roleId: users.roleId}))[0];
        const token = createToken(user);
        res.status(200).json({ ...user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, signupUser };
