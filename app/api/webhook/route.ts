import { NextApiResponse } from "next";

export async function POST(request: Request, response: NextApiResponse) {
  const body = await request.json();
  console.log("Payload: ", body);
  return new Response("Credential Verified");
}
