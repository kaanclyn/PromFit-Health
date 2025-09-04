PromFit - Fitness & Nutrition Tracking Application

PromFit is a modern desktop application that helps users track their fitness and nutrition goals.

The app is specifically designed to help users monitor their personal progress and achieve their targets.

Features

Personalized profile management

Detailed workout tracking

Meal planning and nutrition tracking

Statistics and progress analysis

BMI calculation and tracking

Goal setting and monitoring

Modern and user-friendly interface

Personal development tracking and reporting

Technologies

Electron (Desktop Application)

HTML5 & CSS3

JavaScript

Node.js

CSV (Data Storage)

Installation

Install Node.js (https://nodejs.org
)

Clone the project

Open the terminal in the project directory

Install dependencies:
npm install

Start the application:
npm start

Development

The application is developed using the Electron framework.

Main application files:

index.html: Main application interface

intro.html: Intro page

styles.css: Main stylesheet

intro.css: Intro page styles

script.js: JavaScript functions

main.js: Electron main process file

Technical Details

Electron Main Process (main.js)

Window management and customization

File system operations

Data storage and management

IPC communication

Data Management

Profile data stored in CSV format

Workout data stored in JSON format

Local file system integration

Automatic backup system

Features

Custom window frame

Transparent background support

Full-screen mode

Developer tools integration

Folder Structure

/profiles: User profiles

/profiles_photos: Profile photos

/workouts: Workout data

/programs: Training programs

IPC Events

Window control events

Data save/load

Profile management

Workout tracking

Folder Layout
/
├── index.html          # Main application page
├── intro.html          # Intro page
├── styles.css          # Main stylesheet
├── intro.css           # Intro page styles
├── script.js           # JavaScript functions
├── main.js             # Electron main process
├── package.json        # Project dependencies
└── README.txt          # This file

Detailed Features

Personal Profile

User information

Body measurements

Goal setting

BMI tracking

Personal development targets

Workout Tracking

Create custom programs

Exercise library

Progress monitoring

Calorie burn calculation

Performance improvement analysis

Nutrition Tracking

Meal planning

Calorie tracking

Macronutrient calculation

Food library

Nutrition habits analysis

Statistics

Progress charts

Goal tracking

Performance analysis

Recommendations

Development reports

Version Info

Version: 3.3.6 / 1.0.0

Last Update: 26/05/2025

Developer: PromSoftware

Contact

Web: https://promsoftware.com.tr

Email: destek@promsoftware.com.tr

License

© 2021-2025 PromSoftware. All rights reserved.

Developer Rights and Usage

This application is provided as open source for software developers and programmers. The following rights and permissions are granted:

Development & Customization

Modify and improve source code

Add new features

Customize existing features

Adapt for different platforms

Commercial Use

Use for commercial purposes

Redistribute

Sub-license

Integrate into commercial projects

Developer Requirements

Retain PromSoftware copyright notice

Preserve original license terms

Document modifications

Disclaimer

The application is provided “as is”

PromSoftware is not responsible for consequences of its use

Developers use at their own risk

Notes

Developed using the Electron framework

Data stored locally in CSV format

Modern and user-friendly interface design

Responsive design support

Dark/Light theme support

Detailed analysis tools supporting user progress

Features guiding users to achieve personal goals

Open source and commercial usage support

Data Storage Structure

The application stores user data in the local file system with the following structure:

Main Data Folder: /profiles

User profiles stored in CSV format

Filename format: username_date.csv

Example: kaan_caglayan_2025-05-26T08-29-57-889Z.csv

Profile Photos: /profiles/profiles_photos

User profile photos stored in PNG format

Filename format: username_date.png

Example: kaan_caglayan_2025-05-26T08-29-39-625Z.png

Data Formats

CSV Files:

User information

Body measurements

Goals

Timestamp

PNG Files:

Profile photos

Converted from Base64

Auto-resized

Data Security

Local storage

Automatic backups

Data integrity checks

Secure file handling

Planned Features and Development Roadmap

Multi-Platform Support

Native apps for Windows, macOS, and Linux

Web-based version

Mobile app (iOS/Android)

Cross-platform synchronization

Multi-User System

User accounts and authentication

Role-based access control

Group management and sharing

Social features and interaction

Payment Systems

Subscription model

Premium features

Payment history

Invoice management

Multi-currency support

Auto-renewal

Advanced Data Tracking

Real-time monitoring

Detailed analytics reports

Customizable dashboards

Data visualization

Trend analysis

Predictive models

Database Options

SQLite (Local storage)

PostgreSQL (Relational database)

MongoDB (NoSQL solution)

Redis (Cache and session management)

Firebase (Realtime database)

Licensing System

User-based licensing

Enterprise licenses

Feature-based licensing

Time-limited licenses

License validation and renewal

Offline license activation

Security Enhancements

Two-factor authentication

End-to-end encryption

Secure data backup

GDPR compliance

Data privacy controls

Integrations

Sync with fitness devices

Health app integrations

Calendar systems

Cloud storage services

Social media platforms

Performance Improvements

Cache optimization

Lazy loading

Code splitting

Asset optimization

Load balancing

User Experience

Customizable interface

Theme support

Accessibility features

Multi-language support

Keyboard shortcuts
