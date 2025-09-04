PromFit - Fitness & Nutrition Tracking App
===========================================

- PromFit is a modern desktop application that helps users track their fitness and nutrition goals. 
- The application is specifically designed to help users track their personal development and achieve their goals.

Features
----------
- Personalized profile management
- Detailed workout tracking
- Nutrition program creation and tracking
- Statistics and progress analysis
- BMI calculation and tracking
- Goal setting and tracking
- Modern and user-friendly interface
- Personal development tracking and reporting

Technologies
-----------
- Electron (Desktop Application)
- HTML5 & CSS3
- JavaScript
- Node.js
- CSV (Data Storage)

Installation
-------
1. Install Node.js (https://nodejs.org)
2. Clone the project
3. Open a terminal in the project directory
4. Install dependencies:
   npm install
5. Start the application:
   npm start

Development
---------
- The application was developed using the Electron framework
- Main application files:
  - index.html: Main application interface
  - intro.html: Introductory page
  - styles.css: Main style sheet
  - intro.css: Introductory page styles
  - script.js: JavaScript functions
  - main.js: Electron main process file

Technical Details
--------------
1. Electron Main Process (main.js)
   - Window management and customization
   - File system operations
   - Data storage and management
   - IPC communication

2. Data Management
   - Profile data in CSV format
   - Training data in JSON format
   - Local file system integration
   - Automatic backup system

3. Features
   - Customized window frame
   - Transparent background support
   - Full-screen mode
   - Developer tools integration

4. Folder Structure
   - /profiles: User profiles
   - /profiles_photos: Profile photos
   - /workouts: Training data
   - /programs: Training programs

5. IPC Events
   - Window control events
   - Data saving/loading
   - Profile management
   - Workout tracking

Folder Structure
------------
/
├── index.html          # Main application page
├── intro.html          # Intro page
├── styles.css          # Main style sheet
├── intro.css           # Intro page styles
├── script.js           # JavaScript code
├── main.js             # Electron main process
├── package.json        # Project dependencies
└── README.txt          # This file

Feature Details
----------------
1. Personal Profile
   - User information
   - Body measurements
   - Goal setting
   - BMI tracking
   - Personal development goals

2. Workout Tracking
   - Custom program creation
   - Exercise library
   - Progress tracking
   - Calorie burn calculation
   - Performance improvement analysis

3. Nutrition Tracking
   - Meal planning
   - Calorie tracking
   - Macro nutrient calculation
   - Food library
   - Nutrition habit analysis

4. Statistics
   - Progress charts
   - Goal tracking
   - Performance analysis
   - Recommendations
   - Progress reports

Version Information
--------------
- Version: 3.3.6 / 1.0.0
- Last Updated: 05/26/2025
- Developer: PromSoftware

Contact
-------
- Web: https://promsoftware.com.tr
- Email: destek@promsoftware.com.tr

License
------
© 2021-2025 PromSoftware. All rights reserved.

Developer Rights and Usage
------------------------------
This application is provided as open source for software developers and programmers. The following rights and permissions are granted:

1. Development and Customization
   - Modifying and developing the source code
   - Adding new features
   - Customizing existing features
   - Adapting to different platforms

2. Commercial Use
   - Use for commercial purposes
   - Redistribution
   - Sublicensing
   - Integration into commercial projects

3. Developer Requirements
   - Maintain PromSoftware's copyright notice
   - Preserve the original license terms
   - Document modifications

4. Disclaimer
   - The application is provided “as is”
   - PromSoftware is not responsible for the results arising from the use of the application
   - Developers use it at their own risk

Notes
------
- The application was developed using the Electron framework
- Data is stored locally in CSV format
- Modern and user-friendly interface design
- Responsive design support
- Dark/Light theme support
- Detailed analytics tools to support user progress
- Features to guide users in achieving personal goals
- Open source and commercial use support for developers

Data Storage Structure
-------------------
The application stores user data in the local file system in the following structure:

1. Main Data Folder: /profiles
   - User profiles are stored in CSV format
   - File name format: username_date.csv
   - Example: kaan_caglayan_2025-05-26T08-29-57-889Z.csv

2. Profile Photos: /profiles/profiles_photos
   - User profile photos are stored in PNG format
   - File name format: username_date.png
   - Example: kaan_caglayan_2025-05-26T08-29-39-625Z.png

3. Data Formats
   - CSV Files:
     * User information
     * Body measurements
     * Goals
     * Timestamp
   
   - PNG Files:
     * Profile photos
     * Converted from Base64 format
     * Automatic resizing

4. Data Security
   - Local storage
   - Automatic backup
   - Data integrity check
   - Secure file operations 

Add-on Features and Development Plans
----------------------------------------
1. Multi-Platform Support
   - Native applications for Windows, macOS, and Linux
   - Web-based version
   - Mobile application (iOS/Android)
   - Cross-platform synchronization

2. Multi-User System
   - User accounts and authorization
   - Role-based access control
   - Group management and sharing
   - Social features and interaction

3. Payment Systems
   - Subscription model
   - Premium features
   - Payment history
   - Invoice management
   - Multi-currency support
   - Automatic renewal

4. Advanced Data Tracking
   - Real-time monitoring
   - Detailed analytical reports
   - Customizable dashboard
   - Data visualization
   - Trend analysis
   - Forecasting models

5. Database Options
   - SQLite (Local storage)
   - PostgreSQL (Relational database)
   - MongoDB (NoSQL solution)
   - Redis (Caching and session management)
   - Firebase (Real-time database)

6. Licensing System
   - User-based licensing
   - Enterprise licenses
   - Feature-based licensing
   - Time-limited licenses
   - License validation and renewal
   - Offline license activation

7. Security Enhancements
   - Two-factor authentication
   - End-to-end encryption
   - Secure data backup
   - GDPR compliance
   - Data privacy controls

8. Integrations
   - Synchronization with fitness devices
   - Health app integration
   - Calendar systems
   - Cloud storage services
   - Social media platforms

9. Performance Improvements
   - Cache optimization
   - Lazy loading
   - Code splitting
   - Asset optimization
   - Load balancing

10. User Experience
    - Customizable interface
    - Theme support
    - Accessibility features
    - Multi-language support
    - Shortcut keys 

Translated with DeepL.com (free version)
