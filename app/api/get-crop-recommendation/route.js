import { NextResponse } from "next/server";

const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

const numberFromBody = (body, ...keys) => {
    for (const key of keys) {
        if (body[key] === undefined || body[key] === "") continue;

        const value = Number(body[key]);
        return Number.isFinite(value) ? value : undefined;
    }

    return undefined;
};

const getCacheKey = ({
    latitude,
    longitude,
    landArea,
    N,
    P,
    K,
    ph,
}) =>
    [
        latitude.toFixed(4),
        longitude.toFixed(4),
        landArea.toFixed(2),
        N ?? "auto",
        P ?? "auto",
        K ?? "auto",
        ph ?? "auto",
    ].join(":");

const fetchRecommendation = async ({
    latitude,
    longitude,
    landArea,
    N,
    P,
    K,
    ph,
}) => {
    const url =
        "https://crop-recommendation-with-economics-api.onrender.com/predict/bylocation";

    const payload = {
        latitude,
        longitude,
        land_area_acres: landArea,

        ...(N !== undefined && { N }),
        ...(N !== undefined && { soil_N: N }),
        ...(P !== undefined && { P }),
        ...(P !== undefined && { soil_P: P }),
        ...(K !== undefined && { K }),
        ...(K !== undefined && { soil_K: K }),
        ...(ph !== undefined && { ph }),
        ...(ph !== undefined && { soil_ph: ph }),
    };

    console.log(
        "[Crop Recommendation API] Sending payload:",
        payload
    );

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const apiData = await res.json();

    console.log(
        "[Crop Recommendation API] Response:",
        apiData
    );

    if (!res.ok || apiData?.success === false) {
        const error = new Error(
            apiData?.message ||
            "Unable to get crop recommendation"
        );

        error.status = res.status || 500;

        throw error;
    }

    return apiData?.data || apiData;
};

export async function POST(request) {
    try {
        const body = await request.json();

        console.log(
            "[REQUEST BODY]",
            JSON.stringify(body, null, 2)
        );

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

        const latitude = Number(body.latitude);
        const longitude = Number(body.longitude);
        const landArea = Number(body.land_area_acres);

        const N = numberFromBody(body, "N", "soil_N");
        const P = numberFromBody(body, "P", "soil_P");
        const K = numberFromBody(body, "K", "soil_K");
        const ph = numberFromBody(body, "ph", "soil_ph");

        const clearCache = body.clear_cache === true;
        const hasManualSoilInput =
            N !== undefined ||
            P !== undefined ||
            K !== undefined ||
            ph !== undefined ||
            body.manual_soil === true;
        const skipCache = hasManualSoilInput || clearCache;

        const cacheKey = getCacheKey({
            latitude,
            longitude,
            landArea,
            N,
            P,
            K,
            ph,
        });

        console.log("CACHE KEY:", cacheKey);
        console.log("CLEAR CACHE:", clearCache);
        console.log("NPK:", { N, P, K, ph });

        if (clearCache) {
            const locationPrefix =
                `${latitude.toFixed(4)}:${longitude.toFixed(4)}:${landArea.toFixed(2)}`;

            for (const key of cache.keys()) {
                if (key.startsWith(locationPrefix)) {
                    cache.delete(key);
                }
            }

            console.log(
                "[CACHE CLEARED FOR LOCATION]",
                locationPrefix
            );
        }

        const cached = skipCache ? undefined : cache.get(cacheKey);
        const now = Date.now();

        if (
            cached &&
            cached.data &&
            now - cached.createdAt < CACHE_TTL_MS
        ) {
            console.log("[CACHE HIT]", cacheKey);

            return NextResponse.json({
                success: true,
                data: cached.data,
                cached: true,
            });
        }

        console.log("[FETCHING FRESH DATA]");

        const promise =
            cached?.promise ||
            fetchRecommendation({
                latitude,
                longitude,
                landArea,
                N,
                P,
                K,
                ph,
            }).catch((error) => {
                cache.delete(cacheKey);
                throw error;
            });

        if (!skipCache) {
            cache.set(cacheKey, {
                promise,
                createdAt: now,
            });
        }

        const data = await promise;

        console.log("[RESPONSE RECEIVED]");

        if (!skipCache) {
            cache.set(cacheKey, {
                data,
                createdAt: Date.now(),
            });
        }

        return NextResponse.json({
            success: true,
            data,
            cached: false,
        });

    } catch (error) {
        console.error(
            "[Crop Recommendation Error]",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Crop recommendation request failed",
                error: error.message,
            },
            {
                status: error.status || 500,
            }
        );
    }
}
