import bcrypt from "bcryptjs";

async function getInitialUser() {
  const password1 = await bcrypt.hash(process.env.APP_PWD, 10);
  const password2 = await bcrypt.hash(process.env.APP_PWD2, 10);
  return [
    [process.env.APP_USER, password1, true],
    [process.env.APP_USER2, password2, false],
  ];
}

export default getInitialUser;
