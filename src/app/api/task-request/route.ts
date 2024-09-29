import { API_BASE_URL } from "@/common/url";
import { NextResponse } from "next/server";

const TASK_REQUEST_URL : string = `${API_BASE_URL}request`

export async function PUT(request: Request) {
    const { 
        email, 
        method, 
        y, 
        chartDataSize, 
        chartLabelCount, 
        taskStatusSnsTopicSubscriptionOption, 
        taskStatusSnsTopicSubscriptionArn, 
        fileName,
        fileType,
        fileData
    } = await request.json();

    if (!fileName) {
        return NextResponse.json({error: 'The name of the file is missing!', fileName}, { status: 500 })
    }

    const response = await fetch(TASK_REQUEST_URL, {
        method: "PUT",
        body: JSON.stringify({
            payload: {
                email, 
                method, 
                y, 
                chartDataSize, 
                chartLabelCount, 
                taskStatusSnsTopicSubscriptionOption, 
                taskStatusSnsTopicSubscriptionArn, 
                originalFileName: fileName
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
        return NextResponse.json(responseObj, { status: response.status })
    } else {
        responseObj = responseObj['data']
    }
    const { putPresignedUrl } = responseObj

    const s3PutResponse = await fetch(putPresignedUrl, {
        method: "PUT",
        body: fileData,
        headers: {
            'Content-type': fileType
        },
        cache: 'no-store'
    })

    return NextResponse.json(responseObj, { status: s3PutResponse.status })
}