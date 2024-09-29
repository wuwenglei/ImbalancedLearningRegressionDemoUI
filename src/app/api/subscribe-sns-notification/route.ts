import { API_BASE_URL } from "@/common/url";
import { NextResponse } from "next/server";

const SUBSCRIBE_SNS_NOTIFICATION_URL : string = `${API_BASE_URL}subscribe-sns-notification`

export async function PUT(request: Request) {
    const { email } = await request.json();
    const response = await fetch(SUBSCRIBE_SNS_NOTIFICATION_URL, {
        method: "PUT",
        body: JSON.stringify({
            payload: {email}
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