import { NextResponse } from "next/server";

const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

const getCacheKey = ({ latitude, longitude, landArea }) =>
    [
        latitude.toFixed(4),
        longitude.toFixed(4),
        landArea.toFixed(2),
    ].join(":");

const fetchRecommendation = async ({ latitude, longitude, landArea }) => {
    const url =
        "https://crop-recommendation-with-economics-api.onrender.com/predict/bylocation";

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            latitude,
            longitude,
            land_area_acres: landArea,
        }),
    });

    const apiData = await res.json();

    if (!res.ok || apiData?.success === false) {
        const error = new Error(
            apiData?.message || "Unable to get crop recommendation"
        );
        error.status = res.status || 500;
        throw error;
    }

    return apiData?.data || apiData;
};

export async function POST(request) {

    try {

        const body = await request.json();

        // VALIDATION FIRST
        if (
            body.latitude === undefined ||
            body.longitude === undefined ||
            body.land_area_acres === undefined
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                },
                {
                    status: 400,
                }
            );

        }

        const latitude =
            Number(body.latitude);

        const longitude =
            Number(body.longitude);

        const landArea =
            Number(body.land_area_acres);

        // CHECK FOR INVALID NUMBERS
        if (
            isNaN(latitude) ||
            isNaN(longitude) ||
            isNaN(landArea)
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid numeric values",
                },
                {
                    status: 400,
                }
            );

        }

        const cacheKey = getCacheKey({
            latitude,
            longitude,
            landArea,
        });
        const cached = cache.get(cacheKey);
        const now = Date.now();

        if (cached && cached.data && now - cached.createdAt < CACHE_TTL_MS) {
            return NextResponse.json({
                success: true,
                data: cached.data,
                cached: true,
            });
        }

        const promise =
            cached?.promise ||
            fetchRecommendation({
                latitude,
                longitude,
                landArea,
            }).catch((error) => {
                cache.delete(cacheKey);
                throw error;
            });

        cache.set(cacheKey, {
            promise,
            createdAt: now,
        });

        const data = await promise;

        cache.set(cacheKey, {
            data,
            createdAt: Date.now(),
        });

        return NextResponse.json({

            success: true,

            data,

        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message || "Crop recommendation request failed",
                error: error.message,
            },
            {
                status: error.status || 500,
            }
        );

    }

}
