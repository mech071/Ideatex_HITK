import { NextResponse } from "next/server";

const toDateString = (date) => date.toISOString().slice(0, 10);

const average = (values) => {
    const numbers = values
        .map(Number)
        .filter((value) => Number.isFinite(value));

    if (!numbers.length) return null;

    return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
};

const sum = (values) =>
    values
        .map(Number)
        .filter((value) => Number.isFinite(value))
        .reduce((total, value) => total + value, 0);

export async function POST(request) {
    try {
        const { district } = await request.json();

        if (!district) {
            return NextResponse.json(
                {
                    success: false,
                    message: "District is required",
                },
                {
                    status: 400,
                }
            );
        }

        const geoRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
                district
            )},IN&limit=1&appid=${process.env.OPENWEATHER_API}`
        );

        const geoData = await geoRes.json();

        if (!geoRes.ok || !geoData.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "District not found",
                },
                {
                    status: geoRes.status || 404,
                }
            );
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API}&units=metric`
        );

        const weatherData = await weatherRes.json();

        if (!weatherRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: weatherData?.message || "Weather lookup failed",
                },
                {
                    status: weatherRes.status || 500,
                }
            );
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 29);

        const climateRes = await fetch(
            `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${toDateString(
                startDate
            )}&end_date=${toDateString(
                endDate
            )}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`
        );

        const climateData = await climateRes.json();
        const dailyTemperature = climateData?.daily?.temperature_2m_mean || [];
        const dailyRainfall = climateData?.daily?.precipitation_sum || [];

        const thirtyDayTemperature =
            average(dailyTemperature) ?? weatherData.main.temp;
        const thirtyDayRainfall =
            average(dailyRainfall) ?? weatherData.rain?.["1h"] ?? 0;
        const thirtyDayRainfallTotal = sum(dailyRainfall);

        const soilRes = await fetch(
            `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=nitrogen&property=phh2o&depth=0-5cm&value=mean`
        );

        const soilData = await soilRes.json();

        const nitrogenLayer = soilData.properties.layers.find(
            (layer) => layer.name === "nitrogen"
        );

        const phLayer = soilData.properties.layers.find(
            (layer) => layer.name === "phh2o"
        );

        const nitrogen =
            nitrogenLayer?.depths?.[0]?.values?.["Q0.5"] || 50;

        const phRaw =
            phLayer?.depths?.[0]?.values?.["Q0.5"] || 65;

        const ph = phRaw / 10;
        const month = new Date().getMonth() + 1;

        let season = "";

        if ([12, 1, 2].includes(month)) {
            season = "Winter";
        } else if ([3, 4, 5].includes(month)) {
            season = "Summer";
        } else if ([6, 7, 8, 9].includes(month)) {
            season = "Monsoon";
        } else {
            season = "Autumn";
        }

        return NextResponse.json({
            success: true,
            district,
            coordinates: {
                lat,
                lon,
            },
            weather: {
                temperature: Number(thirtyDayTemperature.toFixed(1)),
                humidity: weatherData.main.humidity,
                rainfall: Number(thirtyDayRainfall.toFixed(1)),
                rainfall_total_30d: Number(thirtyDayRainfallTotal.toFixed(1)),
                condition: weatherData.weather[0].main,
                season,
                source: "30-day climate data",
            },
            soil: {
                nitrogen: Number(nitrogen),
                ph: Number(ph.toFixed(1)),
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Weather request failed",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
