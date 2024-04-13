const { eq, lt, gte, ne } = require('drizzle-orm');
const jwt = require('jsonwebtoken');
const DrizzleClient = require('../lib/drizzle-client');
const hashPassword = require('../lib/hash_pass');
const compareHash = require('../lib/compare_hash');
const {
  roles,
  users,
  students,
  professors,
  headsOfDepartment,
  departments,
} = require('../db/schema');

const createToken = (user) => {
  return jwt.sign({ user }, 'secret', { expiresIn: '3d' });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'All fields must be filled' });
    return;
  }

  try {
    const user = (
      await DrizzleClient.select().from(users).where(eq(users.email, email))
    )[0];
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await compareHash(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
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
  const { email, password, user_role: role } = req.body;
  if (!roles.enumValues.includes(role)) {
    res.status(400).json({
      error: 'Invalid role\nValid roles are' + roles.enumValues.join(','),
    });
    return;
  }

  if (!email || !password) {
    res
      .status(400)
      .json({
        error: 'All fields must be filled',
        requiredFields: ['email', 'password'],
      });
    return;
  }

  try {
    data = {
      email: email,
      role: role,
      passwordHash: await hashPassword(password),
    };

    if (role === 'student') {
      const { mis } = req.body;
      if (!mis) {
        res
          .status(400)
          .json({
            error: 'All fields must be filled',
            requiredFields: ['mis'],
          });
        return;
      }
      const departmentId = mis.slice(4, 6);
      const year = mis.slice(2, 4);
      const user = (
        await DrizzleClient.insert(users)
          .values(data)
          .returning({
            userId: users.userId,
            role: users.role,
            email: users.email,
            passwordHash: users.passwordHash,
          })
          .execute()
      )[0];

      const token = createToken(user);
      const { userId } = user;
      const studentId = await DrizzleClient.insert(students)
        .values({
          userId: userId,
          mis: mis,
          departmentId: departmentId,
          year: year,
        })
        .returning({ studentId: students.studentId })
        .execute();
      return res
        .status(200)
        .json({ ...user, token, studentId: studentId[0].studentId });
    } else if (role === 'teacher') {
      // insert into professor
      const { name, departmentId, position } = req.body;
      if (!name || !departmentId || !position) {
        res
          .status(400)
          .json({
            error: 'All fields must be filled',
            requiredFields: ['name', 'departmentId', 'position'],
          });
        return;
      }
      const user = (
        await DrizzleClient.insert(users)
          .values(data)
          .returning({
            userId: users.userId,
            role: users.role,
            email: users.email,
            passwordHash: users.passwordHash,
          })
          .execute()
      )[0];

      const token = createToken(user);
      const { userId } = user;
      const professorId = await DrizzleClient.insert(professors)
        .values({
          userId: userId,
          name: name,
          departmentId: departmentId,
          position: position,
          email: email,
        })
        .returning({ professorId: professors.professorId })
        .execute();
      return res
        .status(200)
        .json({ ...user, token, professorId: professorId[0].professorId });
    } else if (role === 'hod') {
      const { departmentId, name } = req.body;
      if (!departmentId || !name) {
        res
          .status(400)
          .json({
            error: 'All fields must be filled',
            requiredFields: ['departmentId', 'name'],
          });
        return;
      }
      // insert in headsOfDepartment
      const user = (
        await DrizzleClient.insert(users)
          .values(data)
          .returning({
            userId: users.userId,
            role: users.role,
            email: users.email,
            passwordHash: users.passwordHash,
          })
          .execute()
      )[0];

      const token = createToken(user);
      const { userId } = user;
      const hodId = await DrizzleClient.insert(headsOfDepartment)
        .values({
          userId: userId,
          name: name,
          email: email,
        })
        .returning({ hodId: headsOfDepartment.hodId })
        .execute();
      console.log(hodId);
      // find departmentId if exists in departments
      const department = await DrizzleClient.select()
        .from(departments)
        .where(eq(departments.departmentId, departmentId));
      console.log(department);
      // if exists update name and hodId
      if (department.length > 0) {
        console.log('<<>>');
        await DrizzleClient.update(departments)
          .set({ headOfDepartmentId: hodId[0].hodId })
          .where(eq(departments.departmentId, departmentId));
        console.log('<<>>');
      } else {
        // insert in departments
        console.log('>>');
        await DrizzleClient.insert(departments)
          .values({
            departmentId: departmentId,
            headOfDepartmentId: hodId[0].hodId,
          })
          .execute();
      }
      return res.status(200).json({ ...user, token, hodId: hodId[0].hodId });
    }
    const user = (
      await DrizzleClient.insert(users)
        .values(data)
        .returning({
          userId: users.userId,
          role: users.role,
          email: users.email,
          passwordHash: users.passwordHash,
        })
        .execute()
    )[0];

    const token = createToken(user);
    const { userId } = user;
    res.status(200).json({ user, token, message: 'User created' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
