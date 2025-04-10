# Stupid Simple Apps - Website

A modern, responsive landing page for "Stupid Simple Apps" design agency that showcases our commitment to straightforward, affordable digital solutions.

## Tech Stack

- **Frontend**: React, Next.js
- **Styling**: Tailwind CSS, Shadcn UI Components
- **Form Handling**: React Hook Form, Zod validation
- **Deployment**: Firebase Hosting

## Running the Site Locally

To run the site locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at http://localhost:3000

## Project Structure

The project is currently in transition, with parallel implementations in both Next.js and client-side React:

- **Next.js version**: Located in the `/app` directory (primary)
- **Client-side React version**: Located in the `/client` directory

## Deployment Instructions

### Setting Up Firebase Hosting

This project is configured to deploy to Firebase Hosting. Follow these steps to set up and deploy:

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the prompts
   - Make note of your Firebase project ID

2. **Initialize Firebase in this Project**:
   - Run the initialization script:
     ```bash
     ./init-firebase.sh
     ```
   - This will guide you through:
     - Logging in to your Firebase account
     - Selecting your Firebase project
     - Configuring hosting settings

   - When prompted:
     - For "public directory", enter: `dist/public`
     - For "single-page app rewrites", select `yes`
     - For GitHub workflow setup, select `no`
     - For file overwrites, select `no` to keep your configurations

3. **Deploy the Site**:
   - Run the deployment script:
     ```bash
     ./deploy-firebase.sh
     ```
   - This will:
     - Build the project
     - Deploy it to Firebase hosting

4. **Access Your Live Site**:
   - Once deployment is complete, your site will be available at:
     - `https://YOUR-PROJECT-ID.web.app`
     - `https://YOUR-PROJECT-ID.firebaseapp.com`

### Troubleshooting

- If you encounter port conflicts (common with port 5000), the server will automatically use port 3000 instead.
- If the initialization or deployment fails, check the error messages for guidance.
- Ensure your Firebase project ID is correctly set in the `.firebaserc` file.

## License

MIT