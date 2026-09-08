# Daily Stress Monitor

Daily Stress Monitor is a React Native mobile application developed as part of a final-year dissertation project at Southampton Solent University.

The application allows adults to complete a short daily reflection using five self-reported factors: anxiety, panic or feeling overwhelmed, sleep quality, workload or responsibility manageability, and energy level. The application calculates an estimated daily stress score between 0 and 100 and provides non-diagnostic feedback to support personal self-monitoring.

## Main Features

- User registration and login
- Five-question daily stress reflection
- Weighted stress score from 0–100
- Five descriptive stress categories
- Mood selection and optional daily notes
- One main reflection per day
- Reflection history through Your Journey
- Wellbeing Trends and pattern information
- Delete reflection with confirmation
- Privacy and information screen
- Password reset and sign out

## Technologies

- React Native
- Expo
- JavaScript
- React Navigation
- Firebase Authentication
- Cloud Firestore

## Prerequisites

To run the project locally, Node.js and npm must be installed.

## Installation

Clone or download the repository and open the project directory.

Install the required dependencies:

npm install

## Running the Application

Start the Expo development server:

npx expo start

To run the web version:

npm run web

## Data Storage

Firebase Authentication is used for user account access.

Daily reflection records are stored in Cloud Firestore and associated with the authenticated user's account.

## Important Notice

Daily Stress Monitor is a non-diagnostic self-monitoring prototype. The stress score and categories are application-defined and have not been clinically validated.

The application is not intended to diagnose, treat, prevent or predict any medical or mental health condition.