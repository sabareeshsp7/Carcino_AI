This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Carcino AI - Carcinoma Cell Detection

This project integrates a CNN-based carcinoma cell detection model with a Next.js frontend.

## Project Structure

- `/api` - FastAPI backend for serving the CNN model
- `/app` - Next.js frontend application
- `/components` - React components for the frontend
- `/api/model` - Directory for storing the trained CNN model

## Installation Instructions

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd carcino-ai
\`\`\`

### 2. Set up the FastAPI backend

\`\`\`bash
cd api

# Install dependencies
pip install -r requirements.txt

# Copy your trained model to the model directory
# The model should be named carcinoma_model.h5
cp /path/to/your/model.h5 model/carcinoma_model.h5

# Start the API server
uvicorn main:app --reload
\`\`\`

Alternatively, you can use Docker:

\`\`\`bash
cd api

# Make the deploy script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
\`\`\`

### 3. Set up the Next.js frontend

\`\`\`bash
# Return to the project root
cd ..

# Install dependencies
npm install

# Create .env.local file
echo "API_URL=http://localhost:8000" > .env.local

# Start the development server
npm run dev
\`\`\`

### 4. Access the application

- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Deployment Options

### Backend Deployment (Free Options)

1. **Render**
   - Sign up at render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the build command: `pip install -r requirements.txt`
   - Set the start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Railway**
   - Sign up at railway.app
   - Create a new project
   - Connect your GitHub repository
   - Railway will automatically detect the Dockerfile

3. **Replit**
   - Sign up at replit.com
   - Create a new Python repl
   - Upload your API code
   - Install dependencies and run the server

### Frontend Deployment

1. **Vercel**
   - Sign up at vercel.com
   - Connect your GitHub repository
   - Vercel will automatically detect the Next.js project
   - Add the API_URL environment variable pointing to your deployed backend

## Troubleshooting

### Common Issues

1. **Model not loading**
   - Ensure the model file is correctly placed in the `/api/model` directory
   - Check that the model filename matches what's expected in the code

2. **CORS errors**
   - If you're getting CORS errors, ensure the backend's CORS middleware is correctly configured with your frontend URL

3. **Slow predictions**
   - Consider using a smaller model or optimizing the existing one
   - Ensure you're using TensorFlow's optimization features

4. **Memory issues on deployment**
   - Choose a deployment option with sufficient memory for your model
   - Consider model quantization to reduce size

### Performance Optimization

1. **Model optimization**
   - Use TensorFlow Lite for smaller model size
   - Consider model quantization to reduce memory usage

2. **Caching**
   - Implement caching for frequent predictions
   - Use Redis or a similar in-memory store for high-performance caching

3. **Batch processing**
   - If processing multiple images, implement batch processing

## License

[Your License]
