```html
<h1 align="center">🌱 Prakriti</h1>

<p align="center">
  AI-Powered Crop Yield Prediction System for Indian Agriculture
</p>

<hr>

<h2>📌 Overview</h2>

<p>
Prakriti is an AI-driven agricultural prediction platform designed to assist Indian farmers and agricultural analysts by providing intelligent crop yield predictions using real-time environmental data and machine learning models.
</p>

<p>
The platform integrates weather APIs, environmental analysis, and predictive ML algorithms to generate accurate agricultural insights and improve decision-making in farming systems.
</p>

<hr>

<h2>🚀 Features</h2>

<ul>
  <li>Crop yield prediction using Machine Learning</li>
  <li>Real-time environmental and weather analysis</li>
  <li>State and district based agricultural insights</li>
  <li>Dynamic climate-responsive UI</li>
  <li>Interactive analytics dashboard</li>
  <li>Prediction history and monitoring</li>
  <li>Responsive modern interface</li>
  <li>Weather-based environmental visualization</li>
</ul>

<hr>

<h2>🛠 Tech Stack</h2>

<h3>Frontend</h3>

<ul>
  <li>Next.js</li>
  <li>React</li>
  <li>Tailwind CSS</li>
  <li>Framer Motion</li>
  <li>Lucide React</li>
</ul>

<h3>Backend</h3>

<ul>
  <li>FastAPI</li>
  <li>Python</li>
</ul>

<h3>Machine Learning</h3>

<ul>
  <li>Scikit-learn</li>
  <li>XGBoost</li>
  <li>Pandas</li>
  <li>NumPy</li>
</ul>

<h3>Database</h3>

<ul>
  <li>MongoDB Atlas</li>
</ul>

<h3>APIs</h3>

<ul>
  <li>OpenWeatherMap API</li>
  <li>Open-Meteo API</li>
  <li>WeatherAPI</li>
</ul>

<h3>Deployment</h3>

<ul>
  <li>Vercel (Frontend)</li>
  <li>Render (Backend)</li>
</ul>

<hr>

<h2>🌾 Problem Statement</h2>

<p>
Agriculture in India is highly dependent on environmental and climatic conditions such as rainfall, humidity, temperature, and soil quality. Farmers often lack access to intelligent systems that can help estimate productivity and environmental suitability for crops.
</p>

<p>
Prakriti addresses this challenge by combining AI-based prediction systems with live environmental analysis to provide meaningful agricultural insights.
</p>

<hr>

<h2>⚙️ Application Workflow</h2>

<ol>
  <li>
    <strong>Landing Page</strong>
    <p>Users are introduced to the platform and its agricultural prediction capabilities.</p>
  </li>

  <li>
    <strong>Location Selection</strong>
    <p>
      Users select their:
    </p>

    <ul>
      <li>State</li>
      <li>District</li>
    </ul>
  </li>

  <li>
    <strong>Environmental Data Fetching</strong>
    <p>
      The system fetches real-time environmental data including:
    </p>

    <ul>
      <li>Temperature</li>
      <li>Humidity</li>
      <li>Rainfall</li>
      <li>Seasonal conditions</li>
      <li>Climate information</li>
    </ul>
  </li>

  <li>
    <strong>User Agricultural Inputs</strong>
    <p>
      Users provide agricultural details such as:
    </p>

    <ul>
      <li>Crop type</li>
      <li>Soil type</li>
      <li>Soil pH</li>
      <li>Land area</li>
      <li>Irrigation information</li>
    </ul>
  </li>

  <li>
    <strong>Machine Learning Prediction</strong>
    <p>
      The backend processes environmental and agricultural data through ML models to generate crop yield predictions.
    </p>
  </li>

  <li>
    <strong>Dashboard Analytics</strong>
    <p>
      The dashboard displays:
    </p>

    <ul>
      <li>Predicted crop yield</li>
      <li>Environmental analysis</li>
      <li>Risk indicators</li>
      <li>Prediction insights</li>
      <li>Data visualizations</li>
    </ul>
  </li>
</ol>

<hr>

<h2>🧠 System Architecture</h2>

<pre>
                ┌────────────────────┐
                │     Frontend       │
                │   Next.js + React  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │    FastAPI Backend │
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
                └────────────────────┘
</pre>

<hr>

<h2>🎨 Dynamic UI System</h2>

<p>
The application interface dynamically adapts based on:
</p>

<ul>
  <li>Time of day</li>
  <li>Weather conditions</li>
  <li>Seasonal climate</li>
  <li>Temperature</li>
</ul>

<p>
Examples:
</p>

<ul>
  <li>Rainy weather → darker visual tones</li>
  <li>Summer afternoons → warmer gradients</li>
  <li>Nighttime → dark themed interface</li>
</ul>

<hr>

<h2>🤖 Machine Learning Pipeline</h2>

<h3>Input Parameters</h3>

<ul>
  <li>Temperature</li>
  <li>Humidity</li>
  <li>Rainfall</li>
  <li>Crop type</li>
  <li>Soil type</li>
  <li>Soil pH</li>
  <li>Irrigation data</li>
  <li>Seasonal conditions</li>
</ul>

<h3>Processing</h3>

<ul>
  <li>Data preprocessing</li>
  <li>Feature normalization</li>
  <li>Prediction inference</li>
  <li>Environmental analysis</li>
</ul>

<h3>Output</h3>

<ul>
  <li>Predicted crop yield</li>
  <li>Agricultural insights</li>
  <li>Environmental analysis</li>
  <li>Risk assessment</li>
</ul>

<hr>

<h2>⏳ Prediction Processing Time</h2>

<p>
Crop prediction may take approximately <strong>60–90 seconds</strong> because the system performs multiple sequential operations before generating the final prediction.
</p>

<p>
The backend first fetches live environmental data from weather APIs based on the selected state and district. These APIs provide:
</p>

<ul>
  <li>Temperature</li>
  <li>Humidity</li>
  <li>Rainfall data</li>
  <li>Climate conditions</li>
  <li>Seasonal information</li>
</ul>

<p>
After collecting the data, the backend:
</p>

<ul>
  <li>Processes environmental parameters</li>
  <li>Normalizes agricultural inputs</li>
  <li>Prepares feature vectors</li>
  <li>Runs Machine Learning inference</li>
  <li>Generates prediction analytics</li>
</ul>

<p>
External API response latency and network conditions may also affect total prediction time.
</p>

<hr>

<h2>🖥 Initial Dashboard Loading Delay</h2>

<p>
The backend is hosted using Render free-tier services.
</p>

<p>
Render automatically places inactive backend services into sleep mode after periods of inactivity in order to conserve resources.
</p>

<p>
When the dashboard is opened after inactivity:
</p>

<ul>
  <li>The backend server wakes up</li>
  <li>Dependencies initialize</li>
  <li>Database connections are restored</li>
  <li>ML services become active</li>
</ul>

<p>
This startup process may take up to <strong>60 seconds</strong> during the first request.
</p>

<p>
Once active, subsequent requests are significantly faster.
</p>

<hr>

<h2>📈 Future Improvements</h2>

<ul>
  <li>Satellite imagery integration</li>
  <li>Crop disease prediction</li>
  <li>Fertilizer recommendation engine</li>
  <li>Regional language support</li>
  <li>Historical agricultural analytics</li>
  <li>AI agricultural chatbot</li>
  <li>Government scheme integration</li>
</ul>

<hr>

<h2>⚡ Installation</h2>

<h3>Clone Repository</h3>

<pre>
git clone https://github.com/your-username/prakriti.git
</pre>

<h3>Frontend Setup</h3>

<pre>
cd frontend
npm install
npm run dev
</pre>

<h3>Backend Setup</h3>

<pre>
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
</pre>

<hr>

<h2>🔐 Environment Variables</h2>

<h3>Frontend</h3>

<pre>
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_WEATHER_API_KEY=
</pre>

<h3>Backend</h3>

<pre>
MONGODB_URI=
WEATHER_API_KEY=
</pre>

<hr>

<h2>📸 Screenshots</h2>

<p>
Add screenshots of:
</p>

<ul>
  <li>Landing Page</li>
  <li>Dashboard</li>
  <li>Prediction Section</li>
  <li>Analytics View</li>
  <li>Weather Integration</li>
  <li>FAQ Page</li>
</ul>

<hr>

<h2>👨‍💻 Contributors</h2>

<ul>
  <li>Snehasis</li>
  <li>Team Prakriti</li>
</ul>

<hr>

<h2>📄 License</h2>

<p>
This project is developed for educational, research, and innovation purposes.
</p>

<hr>

<h2>🌱 Conclusion</h2>

<p>
Prakriti combines artificial intelligence, environmental analysis, and modern web technologies to build an intelligent agricultural support system focused on improving farming decisions and crop productivity in India.
</p>
```



<img width="2175" height="1732" alt="image" src="https://github.com/user-attachments/assets/ccf4a427-4ef9-4755-b2b7-fd9c03ae4d56" />
