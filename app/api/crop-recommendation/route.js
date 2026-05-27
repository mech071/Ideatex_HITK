import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request) {
    try {
        const body = await request.json();

        const res = await fetch(
            "https://crop-recommendation-api-zaf0.onrender.com/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data?.message || "Unable to predict crops",
                },
                {
                    status: res.status,
                }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Crop prediction request failed",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
