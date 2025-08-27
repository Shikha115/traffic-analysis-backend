# Traffic Analysis Backend

The **Traffic Analysis Backend** is a Node.js + Express server that provides APIs for fetching and analyzing website traffic data. It integrates with the [SimilarWeb Traffic API](https://rapidapi.com/) (via RapidAPI) to retrieve traffic information such as visits, country breakdown, and referrers. This backend powers the [Traffic Analysis Frontend](https://github.com/Shikha115/traffic-analysis-frontend).

## 🚀 Features

- **Website Traffic Data**: Fetch real-time traffic statistics for any domain
- **Global Rank & Engagement**: Retrieve global ranking and engagement metrics
- **Country-level Data**: Analyze visits by country
- **Referrers**: Get top referrers for traffic sources
- **Domain Normalization**: Handles variations like `google.com`, `www.google.com`, `http://google.com` as the same domain
- **Error Handling**: Standardized responses for missing routes or invalid domains
- **MongoDB Integration**: Cache and store traffic data with expiration for efficiency

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) with TypeScript
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **HTTP Client**: Axios
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Package Manager**: Yarn or npm

## 📋 Prerequisites

Before running the backend, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Yarn](https://yarnpkg.com/) or npm

You also need a **RapidAPI account** and a subscription to the **SimilarWeb Traffic API** (free tier available).

## 🔑 API Keys

Create a `.env` file in the backend root directory and add:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/trafficdb
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=similarweb-traffic.p.rapidapi.com
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Shikha115/traffic-analysis-backend.git
cd traffic-analysis-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

Development mode with nodemon:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The backend will run on [http://localhost:8000](http://localhost:8000).

## 🔌 API Endpoints

### `GET /api/traffic?domain=example.com`

Fetches traffic data for a given domain.

**Query Params:**

- `domain` (required): Domain to fetch traffic data for

**Example Response:**

```json
{
  "domain": "example.com",
  "globalRank": 123,
  "visits": 456789,
  "countries": [
    { "country": "US", "visits": 123456 },
    { "country": "IN", "visits": 98765 }
  ],
  "referrers": [
    { "source": "google.com", "percentage": 45 },
    { "source": "twitter.com", "percentage": 20 }
  ]
}
```

### `ALL *`

Fallback route:

```json
{
  "message": "Not Found"
}
```

## 📁 Project Structure

```
src/
├── routes/             # API routes
├── constrollers/       # API controllers
├── models/             # MongoDB models
├── config/             # Constants
├── server.ts           # Entry point
├── route.ts            # Route File
└── middlewares/        # Error Handling
```

## 🔗 Frontend

This backend is designed to work with the [Traffic Analysis Frontend](https://github.com/Shikha115/traffic-analysis-frontend).

## 🏗️ Available Scripts

- `npm run clean` - Remove compiled files
- `npm run build` – Compile TypeScript → JavaScript and fix paths
- `npm start` – Run production build
- `npm run dev` – Watch for changes (TypeScript & JSON) and rebuild automatically
- `npm run dev:exec` – Internal script for running after build

## 🌐 Deployment

You can deploy the backend to:

- Heroku
- Render
- Railway
- Docker containers
- AWS / GCP / Azure

Make sure to set environment variables on your hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for traffic data analysis and visualization.
