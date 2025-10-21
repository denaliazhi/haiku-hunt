import bcrypt from "bcryptjs";

async function getInitialUser() {
  const password = await bcrypt.hash(process.env.APP_PWD, 10);
  return [[process.env.APP_USER, password, true]];
}

export default getInitialUser;
