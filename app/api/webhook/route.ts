import { NextApiResponse } from "next";

export async function POST(request: Request, response: NextApiResponse) {
    const body = await request.json();
    return new Response('Credential Verified')
}