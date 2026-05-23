import { NextResponse } from "next/server";

export async function POST(request) {

    const { district } = await request.json();

    // STEP 1 — GET COORDINATES
    const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${district},IN&limit=1&appid=${process.env.OPENWEATHER_API}`
    );

    const geoData = await geoRes.json();

    if (!geoData.length) {

        return NextResponse.json(
            {
                success: false,
                message: "District not found",
            },
            {
                status: 404,
            }
        );
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // STEP 2 — GET WEATHER
    const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API}&units=metric`
    );

    const weatherData = await weatherRes.json();

    // STEP 3 — SEASON LOGIC
    const month = new Date().getMonth() + 1;

    let season = "";

    if ([12, 1, 2].includes(month)) {
        season = "Winter";
    }
    else if ([3, 4, 5].includes(month)) {
        season = "Summer";
    }
    else if ([6, 7, 8, 9].includes(month)) {
        season = "Monsoon";
    }
    else {
        season = "Autumn";
    }

    // STEP 4 — FINAL RESPONSE
    return NextResponse.json({
        success: true,

        district,

        coordinates: {
            lat,
            lon,
        },

        weather: {
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            rainfall: weatherData.rain?.["1h"] || 0,
            condition: weatherData.weather[0].main,
            season,
        },
    });
}