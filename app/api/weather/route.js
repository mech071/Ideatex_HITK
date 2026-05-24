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

    // STEP 3 — SOIL DATA
    const soilRes = await fetch(
        `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=nitrogen&property=phh2o&depth=0-5cm&value=mean`
    );

    const soilData = await soilRes.json();

    const nitrogenLayer =
        soilData.properties.layers.find(
            (layer) => layer.name === "nitrogen"
        );

    const phLayer =
        soilData.properties.layers.find(
            (layer) => layer.name === "phh2o"
        );

    const nitrogen =
        nitrogenLayer?.depths?.[0]?.values?.["Q0.5"] || 50;

    const phRaw =
        phLayer?.depths?.[0]?.values?.["Q0.5"] || 65;

    const ph = phRaw / 10;

    // STEP 4 — SEASON LOGIC
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

    // STEP 5 — FINAL RESPONSE
    return NextResponse.json({

        success: true,

        district,

        coordinates: {
            lat,
            lon,
        },

        weather: {

            temperature:
                weatherData.main.temp,

            humidity:
                weatherData.main.humidity,

            rainfall:
                weatherData.rain?.["1h"] || 0,

            condition:
                weatherData.weather[0].main,

            season,
        },

        soil: {

            nitrogen:
                Number(nitrogen),

            ph:
                Number(ph.toFixed(1)),
        },
    });
}