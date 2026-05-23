import { NextResponse } from "next/server";

export async function POST(request) {

    const body = await request.json();

    const url =
        "https://crop-recommendation-api-zaf0.onrender.com/predict";

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json({
        success: true,
        data,
    });
}