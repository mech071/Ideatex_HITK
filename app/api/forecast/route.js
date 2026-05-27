import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { latitude, longitude } = await request.json();

        if (latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Latitude and longitude are required",
                },
                {
                    status: 400,
                }
            );
        }

        const lat = Number(latitude);
        const lon = Number(longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid coordinates",
                },
                {
                    status: 400,
                }
            );
        }

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API}&units=metric`
        );
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data?.message || "Forecast lookup failed",
                },
                {
                    status: res.status,
                }
            );
        }

        const forecast =
            data?.list
                ?.filter((_, index) => index % 8 === 0)
                .slice(0, 5) || [];

        return NextResponse.json({
            success: true,
            forecast,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Forecast request failed",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
