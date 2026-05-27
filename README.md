# Prakriti 🌱

Prakriti is an AI-powered crop yield prediction system designed for Indian agriculture.  
The platform combines real-time environmental data, machine learning models, and modern web technologies to help users analyze agricultural conditions and predict crop productivity.

---

# Features

- Crop yield prediction using Machine Learning
- Real-time weather and environmental data
- State & district based agricultural insights
- Dynamic UI based on climate and daytime
- Crop recommendation support
- Risk and environmental analysis
- Interactive dashboard
- Modern responsive UI
- Multi-page architecture with analytics support

---

# Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Backend
- FastAPI (Python)

## Machine Learning
- Python
- Scikit-learn
- XGBoost
- Pandas
- NumPy

## Database
- MongoDB Atlas

## APIs
- OpenWeatherMap API
- Open-Meteo API
- WeatherAPI

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# Problem Statement

Agriculture in India is heavily dependent on environmental conditions such as rainfall, temperature, humidity, and soil quality.  
Farmers often lack accessible predictive tools that can assist in estimating crop productivity and environmental suitability.

Prakriti aims to bridge this gap by providing:
- AI-driven crop yield prediction
- Real-time environmental analysis
- Smart agricultural insights

---

# Application Workflow

## Step 1 — Landing Page
Users are introduced to the platform with an overview of the system and its purpose.

↓

## Step 2 — Location Selection
Users select:
- State
- District

↓

## Step 3 — Environmental Data Fetching
The application fetches:
- Temperature
- Humidity
- Rainfall
- Seasonal conditions
- Weather data

using live APIs.

↓

## Step 4 — User Inputs
Users provide additional agricultural details such as:
- Crop type
- Soil type
- Soil pH
- Land area
- Irrigation information

↓

## Step 5 — Machine Learning Prediction
The backend processes:
- Environmental data
- User agricultural inputs

and sends them to the ML model.

↓

## Step 6 — Prediction Output
The dashboard displays:
- Predicted crop yield
- Environmental analysis
- Risk indicators
- Recommendations
- Data visualizations

---

# System Architecture

```text
                ┌────────────────────┐
                │     Frontend       │
                │   Next.js + React  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │    API Layer       │
                │  FastAPI Backend   │
                └─────────┬──────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│ Weather APIs     │          │ Machine Learning │
│ Real-time Data   │          │ Prediction Model │
└──────────────────┘          └──────────────────┘
                          │
                          ▼
                ┌────────────────────┐
                │    MongoDB Atlas   │
                │ Prediction Storage │
                └────────────────────┘
```


# Machine Learning Pipeline

## Input Parameters
- Temperature
- Humidity
- Rainfall
- Soil type
- Soil pH
- Crop type
- Irrigation data
- Seasonal data

## Processing
- Data preprocessing
- Feature scaling
- Environmental normalization
- Prediction inference

## Output
- Predicted crop yield
- Productivity analysis
- Agricultural recommendations

---

# Why Prediction Takes Time

The crop prediction process may take approximately **60–90 seconds** because:

- Multiple real-time weather APIs are queried
- Environmental data is processed dynamically
- Backend preprocessing is performed
- ML models analyze multiple agricultural parameters
- Prediction generation occurs sequentially

Network latency and external API response times can also affect prediction duration.

---

# Initial Dashboard Loading Delay

The backend is deployed using Render free-tier services.

Render automatically places inactive backend services into sleep mode to conserve resources.  
When the dashboard is opened after inactivity:
- The backend server wakes up
- Dependencies and runtime initialize
- Database connections are restored

This process may take up to **60 seconds** during the first request.

Subsequent requests are significantly faster.

---

# Future Improvements

- Satellite imagery integration
- Soil scanning support
- Regional language support
- Disease prediction system
- Fertilizer recommendation engine
- Historical analytics dashboard
- AI chatbot for agricultural support
- Government scheme integration

---

# Screenshots

<img width="1600" height="825" alt="WhatsApp Image 2026-05-27 at 7 26 36 PM" src="https://github.com/user-attachments/assets/2847284f-259a-4ab0-b602-995af73ce6a4" />
<img width="1600" height="829" alt="WhatsApp Image 2026-05-27 at 7 26 36 PM (1)" src="https://github.com/user-attachments/assets/3d596520-be57-453d-ad12-89d6e07cb678" />
<img width="1600" height="829" alt="WhatsApp Image 2026-05-27 at 7 26 36 PM (1)" src="https://github.com/user-attachments/assets/ce81c1f0-fa89-44eb-99f3-dcdbbe232743" />
<img width="1600" height="824" alt="WhatsApp Image 2026-05-27 at 7 26 36 PM (2)" src="https://github.com/user-attachments/assets/d6b20c4a-01bf-4f8d-b6e3-c9ef5c64f3b8" />
<img width="2175" height="1732" alt="image" src="https://github.com/user-attachments/assets/ccf4a427-4ef9-4755-b2b7-fd9c03ae4d56" />
---

# Contributors

- Snehasis Chakraborty
- Team Prakriti

---

# License

This project is developed for educational and innovation purposes.

---

# Conclusion

Prakriti combines AI, environmental analytics, and modern web technologies to create an intelligent agricultural prediction platform focused on improving decision-making in Indian farming systems.

