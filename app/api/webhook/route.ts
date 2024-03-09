export async function POST(request: Request) {
    const body = await request.json();
    console.log(body)
}

export async function GET(request: Request) {
    return new Response('Hello World')
}