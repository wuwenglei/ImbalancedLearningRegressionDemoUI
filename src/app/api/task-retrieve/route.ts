import { API_BASE_URL } from "@/common/url";
import { NextResponse } from "next/server";

const TASK_RETRIEVE_URL : string = `${API_BASE_URL}retrieve`

export async function PUT(request: Request) {
    const { 
        requestId,
        email
    } = await request.json();

    const response = await fetch(TASK_RETRIEVE_URL, {
        method: "PUT",
        body: JSON.stringify({
            payload: {
                requestId,
                email
            }
        }),
        headers: {
            'Content-type': 'application/json'
        },
        cache: 'no-store'
    })
    let responseObj = await response.json()
    if (!response.ok) {
        responseObj = responseObj['error']
    } else {
        responseObj = responseObj['data']
    }
    return NextResponse.json(responseObj, { status: response.status })
}