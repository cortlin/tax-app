import { abound } from "../../utils/aboundConfig";

export default async function createUser(req, res) {
  const jsonData = JSON.parse(req.body);
  console.log(jsonData.emailAddress);
  try {
    const response = await abound.users.create({
      email: jsonData.emailAddress,
      profile: {},
    });

    res.json(response);
  } catch (error) {
    res.json(error);
  }
}
