# Daily Stress Monitor

Daily Stress Monitor is a React Native application developed as part of a final-year dissertation project at Southampton Solent University.

The application allows adults to complete a short daily reflection using five self-reported factors: anxiety, panic or feeling overwhelmed, sleep quality, workload or responsibility manageability, and energy level.

Based on these responses, the application calculates an estimated daily stress score between 0 and 100 and provides non-diagnostic feedback to support personal self-monitoring. Users can also track their previous results and receive personalised wellbeing activities based on their current stress level and personal preferences.

## Main Features

- User registration and login
- Five-question daily stress reflection
- Weighted stress score from 0–100
- Five descriptive stress categories: Low, Mild, Moderate, High and Very High
- Explanation of the calculated stress score
- Mood selection and optional daily notes
- One main reflection per day
- Reflection history through Your Journey
- Wellbeing Trends and pattern information
- Positive Profile for recording personal preferences
- Personalised wellbeing challenges based on the stress result and Positive Profile
- Interactive wellbeing activities
- Feedback after completing an activity
- What Helps Me information based on previous activity feedback
- Delete reflection with confirmation
- Privacy and information screen
- Password reset and sign out

## Stress Score

The daily stress score uses five weighted self-reported factors:

- Anxiety: 25%
- Panic or feeling overwhelmed: 20%
- Sleep quality: 20%
- Workload or responsibilities: 20%
- Energy level: 15%

Sleep quality and energy level are reverse-scored because lower values can contribute to a higher estimated stress score.

The final percentage is grouped into five application-defined categories:

- Low: 0–20
- Mild: 21–40
- Moderate: 41–60
- High: 61–80
- Very High: 81–100

These categories are used only to provide understandable feedback within the application and are not clinical classifications.

## Personalised Wellbeing Support

Users can create a Positive Profile containing information about things that may help them feel supported or relaxed, such as favourite activities, music, positive memories, calming places and important people.

After a daily stress result, the application can use the current stress level together with the Positive Profile to provide a personalised wellbeing challenge.

Users can complete an interactive wellbeing activity and provide feedback afterwards. Previous feedback can be used to identify activities that the user has found helpful and support future challenge selection.

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

User information, daily reflection records, Positive Profile information and wellbeing activity feedback are stored in Cloud Firestore and associated with the authenticated user's account.

## Privacy and Safety

The application is designed as a self-monitoring prototype. Personal reflection data is associated with the authenticated user's account, and users can remove their reflection records from within the application.

The application does not provide a medical diagnosis or replace professional support.

## Important Notice

Daily Stress Monitor is a non-diagnostic self-monitoring prototype. The stress score, weighting and categories are application-defined and have not been clinically validated.

The application is not intended to diagnose, treat, prevent or predict any medical or mental health condition.
