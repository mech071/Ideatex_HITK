"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const initialState = {
    user: null,
    weatherLookup: null,
    overviewRecommendation: null,
    overviewLoading: false,
    overviewError: "",
    recommendation: null,
    recommendationLoading: false,
    forecast: [],
    forecastLoading: false,
    forecastError: "",
    loading: true,
    error: "",
    recommendationError: "",
};

let dashboardCache = {
    email: "",
    state: initialState,
    promise: null,
};

const subscribers = new Set();

const notify = () => {
    subscribers.forEach((subscriber) => subscriber(dashboardCache.state));
};

const updateCache = (nextState) => {
    dashboardCache = {
        ...dashboardCache,
        state: {
            ...dashboardCache.state,
            ...nextState,
        },
    };
    notify();
    persistLoadedData();
};

const cacheKeyFor = (email) => `prakriti-dashboard-data:v2:${email}`;

const persistLoadedData = () => {
    if (
        typeof window === "undefined" ||
        !dashboardCache.email ||
        dashboardCache.state.loading ||
        dashboardCache.state.overviewLoading ||
        dashboardCache.state.recommendationLoading ||
        dashboardCache.state.error
    ) {
        return;
    }

    window.sessionStorage.setItem(
        cacheKeyFor(dashboardCache.email),
        JSON.stringify({
            ...dashboardCache.state,
            overviewLoading: false,
            recommendationLoading: false,
        })
    );
};

const restoreLoadedData = (email) => {
    if (typeof window === "undefined") return null;

    const cached = window.sessionStorage.getItem(cacheKeyFor(email));
    if (!cached) return null;

    try {
        const parsed = JSON.parse(cached);

        if (parsed.overviewLoading || parsed.recommendationLoading) {
            window.sessionStorage.removeItem(cacheKeyFor(email));
            return null;
        }

        return {
            ...initialState,
            ...parsed,
            loading: false,
        };
    } catch {
        window.sessionStorage.removeItem(cacheKeyFor(email));
        return null;
    }
};

const getForecast = async (lat, lon) => {
    const res = await fetch("/api/forecast", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            latitude: lat,
            longitude: lon,
        }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.message || "Forecast lookup failed");
    }

    return data.forecast || [];
};

const loadForecast = async (latitude, longitude) => {
    try {
        const forecast = await getForecast(latitude, longitude);

        updateCache({
            forecast,
            forecastLoading: false,
            forecastError: "",
        });
    } catch (error) {
        updateCache({
            forecast: [],
            forecastLoading: false,
            forecastError: error.message,
        });
    }
};

const loadOverviewRecommendation = async (weatherLookup) => {
    try {
        const res = await fetch("/api/crop-recommendation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(60000),
            body: JSON.stringify({
                N: weatherLookup.soil.nitrogen,
                P: 42,
                K: 43,
                ph: weatherLookup.soil.ph,
                temperature: weatherLookup.weather.temperature,
                humidity: weatherLookup.weather.humidity,
                rainfall:
                    weatherLookup.weather.rainfall_total_30d ??
                    weatherLookup.weather.rainfall,
            }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json.message || "Overview prediction failed");
        }

        updateCache({
            overviewRecommendation: json.data,
            overviewLoading: false,
            overviewError: "",
        });
    } catch (error) {
        updateCache({
            overviewLoading: false,
            overviewError: error.message,
        });
    }
};

const loadDashboardData = async (firebaseUser) => {
    const email = firebaseUser.email;

    if (dashboardCache.email === email && dashboardCache.promise) {
        return dashboardCache.promise;
    }

    if (
        dashboardCache.email === email &&
        dashboardCache.state.user &&
        (dashboardCache.state.recommendation ||
            dashboardCache.state.recommendationLoading)
    ) {
        return dashboardCache.promise;
    }

    const restoredState = restoreLoadedData(email);
    if (restoredState?.user) {
        dashboardCache = {
            email,
            state: restoredState,
            promise: null,
        };
        notify();
        return null;
    }

    dashboardCache = {
        email,
        state: {
            ...initialState,
            loading: true,
        },
        promise: null,
    };
    notify();

    dashboardCache.promise = (async () => {
        try {
            const userRes = await fetch(
                `/api/user?email=${encodeURIComponent(email)}`
            );
            const userJson = await userRes.json();

            if (!userRes.ok) {
                throw new Error(userJson.message || "User not found");
            }

            const user = userJson.user;
            const weatherRes = await fetch("/api/weather", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    district: user.district,
                }),
            });
            const weatherLookup = await weatherRes.json();

            if (!weatherRes.ok || !weatherLookup.success) {
                throw new Error(
                    weatherLookup.message || "District lookup failed"
                );
            }

            const latitude = weatherLookup.coordinates.lat;
            const longitude = weatherLookup.coordinates.lon;
            const landArea = Number(user.land_area_acres || 1);

            updateCache({
                user,
                weatherLookup,
                overviewRecommendation: null,
                overviewLoading: true,
                overviewError: "",
                recommendation: null,
                recommendationLoading: true,
                forecast: [],
                forecastLoading: true,
                forecastError: "",
                loading: false,
                error: "",
                recommendationError: "",
            });

            loadOverviewRecommendation(weatherLookup);
            loadForecast(latitude, longitude);

            const recommendationRes = await fetch(
                "/api/get-crop-recommendation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        latitude,
                        longitude,
                        land_area_acres: landArea,
                    }),
                },
            );

            const recommendationJson = await recommendationRes.json();

            if (!recommendationRes.ok || !recommendationJson.success) {
                throw new Error(
                    recommendationJson.message || "Crop recommendation failed"
                );
            }

            updateCache({
                user,
                weatherLookup,
                recommendation: recommendationJson.data,
                recommendationLoading: false,
                loading: false,
                error: "",
                recommendationError: "",
            });
        } catch (error) {
            updateCache({
                recommendationLoading: false,
                loading: false,
                error:
                    dashboardCache.state.user && dashboardCache.state.weatherLookup
                        ? ""
                        : error.message,
                recommendationError:
                    dashboardCache.state.user && dashboardCache.state.weatherLookup
                        ? error.message
                        : "",
            });
        } finally {
            dashboardCache = {
                ...dashboardCache,
                promise: null,
            };
        }
    })();

    return dashboardCache.promise;
};

export function clearDashboardDataCache() {
    if (typeof window !== "undefined" && dashboardCache.email) {
        window.sessionStorage.removeItem(cacheKeyFor(dashboardCache.email));
    }

    dashboardCache = {
        email: "",
        state: initialState,
        promise: null,
    };
    notify();
}

export function refreshDashboardData() {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
        clearDashboardDataCache();
        return null;
    }

    clearDashboardDataCache();
    return loadDashboardData(firebaseUser);
}

export function useDashboardData() {
    const router = useRouter();
    const state = useSyncExternalStore(
        (subscriber) => {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        },
        () => dashboardCache.state,
        () => initialState
    );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                clearDashboardDataCache();
                router.push("/login");
                return;
            }

            loadDashboardData(firebaseUser);
        });

        return () => {
            unsubscribe();
        };
    }, [router]);

    return state;
}
export async function regenerateRecommendation({
    N,
    P,
    K,
    ph,
}) {
    const state = dashboardCache.state;

    const latitude = state.weatherLookup?.coordinates?.lat;
    const longitude = state.weatherLookup?.coordinates?.lon;
    const landArea = Number(state.user?.land_area_acres || 1);

    if (!latitude || !longitude) {
        throw new Error("Location unavailable");
    }

    try {
        updateCache({
            recommendationLoading: true,
            recommendationError: "",
        });

        const response = await fetch(
            "/api/get-crop-recommendation",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    latitude,
                    longitude,
                    land_area_acres: landArea,

                    N: Number(N),
                    P: Number(P),
                    K: Number(K),
                    ph: Number(ph),

                    manual_soil: true,
                }),
            }
        );

        const json = await response.json();

        if (!response.ok || !json.success) {
            throw new Error(
                json.message ||
                    "Failed to regenerate recommendations"
            );
        }

        updateCache({
            recommendation: json.data,
            recommendationLoading: false,
            recommendationError: "",
        });
    } catch (error) {
        updateCache({
            recommendationLoading: false,
            recommendationError: error.message,
        });

        throw error;
    }
}