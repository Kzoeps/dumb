import { NextApiResponse } from "next";
import Cors from "micro-cors"
import { redirect } from "next/navigation";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export async function POST(request: Request, response: NextApiResponse) {
    const body = await request.json();
    return new Response('Hello World')
}

export async function GET(request: Request) {
    return new Response('Hello World')
}