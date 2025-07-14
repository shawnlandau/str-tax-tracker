# Firebase Setup Guide

## Setting up Firebase for your STR Tax Tracker

Your app is now configured to use Firebase Firestore as the online database instead of localStorage. This ensures your data is safely stored in the cloud and won't be lost.

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "str-tax-tracker")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In your Firebase project console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll set up security rules later)
4. Select a location for your database (choose the closest to you)
5. Click "Done"

### Step 3: Get Your Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "STR Tax Tracker")
6. Copy the configuration object

### Step 4: Create Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with the actual values from your Firebase configuration.

### Step 5: Set Up Firestore Security Rules

1. In your Firebase console, go to Firestore Database
2. Click the "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for now
    // In production, you should add proper authentication
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click "Publish"

### Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Add a property or log some work hours
3. Check your Firebase console to see the data being stored

### Benefits of Firebase

✅ **Data Safety**: Your data is stored in Google's cloud and won't be lost
✅ **Cross-Device Sync**: Access your data from any device
✅ **Backup & Recovery**: Automatic backups and data recovery
✅ **Scalability**: Handles large amounts of data efficiently
✅ **Real-time Updates**: Data updates in real-time across devices
✅ **Offline Support**: Works offline and syncs when connection returns

### Security Note

The current setup allows anyone to read/write to your database. For production use, you should:

1. Implement Firebase Authentication
2. Set up proper security rules based on user authentication
3. Consider using Firebase Hosting for deployment

### Troubleshooting

If you encounter issues:

1. **Check your environment variables**: Make sure all Firebase config values are correct
2. **Verify Firestore is enabled**: Ensure you've created the Firestore database
3. **Check browser console**: Look for any Firebase-related errors
4. **Test with a simple property**: Try adding a test property to verify the connection

### Data Migration

If you have existing data in localStorage, you can:

1. Use the "Data Manager" in your app to export your current data
2. After setting up Firebase, use the import function to restore your data
3. Or manually add your properties and data through the app interface

Your data will now be safely stored in the cloud! 🎉 