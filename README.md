# 🏃‍♀️ RunVenture

**RunVenture** is a lightweight fitness tracking app focused on running. It is inspired by [MapMyRun.com](https://www.mapmyrun.com/). This project began with a detailed analysis of MapMyRun’s web and mobile platforms, followed by redesign, prototyping, usability testing, and full development in React.js.

Built with React.js and multiple APIs, all user data is stored locally using `localStorage`. The final product showcases five key feature enhancements compared to MapMyRun.com, along with improved visual design and usability.

---

## 🚀 Try the Prototype

You can test out the live prototype here:

🔗 [https://runventureapp.com](https://runventureapp.com)

- Use **any email address** and **any password** to create a test account.
- There is **no real authentication** — login info is stored in `localStorage` for testing purposes only.
- Once signed in, you’ll be redirected to the personalized dashboard to explore features like route tracking, training plans, and more.

⚠️ **Note:** This is a prototype intended for demonstration and testing only. Do not use real credentials.

---

## 🔧 Functionality & APIs

| Feature / API                        | Usage in App                                       | Powered By                    |
|--------------------------------------|---------------------------------------------------|-------------------------------|
| **Geolocation API**                 | Tracks live GPS position during runs              | Browser API                   |
| **Google Maps JavaScript API**      | Displays maps, markers, and live user location    | Google                        |
| **Google Maps Directions API**      | Snaps route paths to real roads                   | Google                        |
| **Google Maps Elevation API**       | Calculates elevation at route midpoints           | Google                        |
| **Spotify Web Playback SDK / API** | Embeds music playback and playlist control        | Spotify                       |
| **localStorage**                   | Stores user sessions, runs, challenges, goals     | Browser API                   |
| **Clipboard API**                  | Enables copy-to-clipboard for challenge sharing   | Browser API                   |
| **Responsive Layout (HTML/CSS)**   | Ensures usability on desktop and mobile devices   | HTML5 + CSS3                  |
| **Canvas API**                     | Displays animated confetti on success             | Browser API                   |

---

## ✅ Supported Platforms

| Platform           | Status      | Notes                                                             |
|--------------------|-------------|-------------------------------------------------------------------|
| **Desktop Browsers** | ✅ Supported | Chrome, Firefox, Edge, Safari (latest versions recommended)    |
| **Android Devices** | ✅ Supported | Tested with Chrome and Firefox for Android                      |
| **iOS Devices**     | ✅ Supported | Tested with Safari and Chrome on iPhone                         |
| **iPadOS**          | ✅ Supported | Responsive layout adapts well to tablets                        |

---

## 🧩 Compatibility Notes & Known Limitations

- **Spotify Playback on iOS Safari**: Due to Apple autoplay restrictions and Spotify SDK limitations, embedded playback may not work consistently on Safari for iOS. A Spotify Premium account may be required.
- **Older Browsers**: Browsers that don’t support modern JavaScript features (like ES6 or `localStorage`) are not supported.
- **Private Browsing / Incognito Mode**: Some browsers, especially Safari in Private Mode, may block or clear `localStorage`, affecting login and data persistence.

---

## 🛠️ Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Create a `.env` file in the root directory** with the following contents (replace with your actual keys):

   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
   REACT_APP_SPOTIFY_CLIENT_ID=your-spotify-client-id
   REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/spotify-callback
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Open your browser and go to**:

   ```bash
   http://localhost:3000
   ```

---

## 🏃‍♀️ How to Use RunVenture

1. **Create an Account**  
   Sign up with any email and password to unlock your personalized dashboard.

2. **Choose How You Want to Run**  
   - Start a live GPS-tracked run immediately from the **Dashboard**.  
   - Or head to **Route Conditions** to preview and select a route based on difficulty, surface type, elevation, traffic, and effort.

3. **Track and Finish Your Run**  
   As you run, your stats update in real-time. When you're done, press and hold the **Hold to Finish** button to save your session.

4. **Run with Music**  
   Use the Run Radio **Spotify player** while running:  
   - Play a default playlist or load one by URL.  
   - Logged-in users can also choose from their own playlists.

5. **Review Your Progress**  
   After finishing a run, you'll see a detailed **Post-Run Summary** with performance highlights, run stats, and personalized insights.

6. **Stay on Track and Get Social**  
   - Explore and edit your personalized **Training Plan**.  
   - Join community-driven **Social Challenges** to compete with friends and stay motivated.

---

## 🧑‍🔧 Troubleshooting & Common Issues

Here are some common issues you might encounter when running or using **RunVenture**, along with how to fix them:

### 1. **App Won’t Start After Unzipping**:
- **Fix:** Run `npm install` inside the unzipped directory to install missing dependencies.
- Ensure you’re using Node.js v18.19.1 and npm v10.2.4 for compatibility (or newer).

### 2. **Google Maps Doesn't Load**:
- **Fix:** Make sure you've added your own Google Maps API key to a `.env` file:
  ```
  REACT_APP_GOOGLE_MAPS_API_KEY=your-api-key-here
  ```
- Restart the development server after updating `.env`.

### 3. **Spotify Player Not Working**:
- **Fix:** Spotify integration in this app uses the free version of the Spotify API.  
- You do not need Spotify Premium to use the player, but playback is limited to 30-second previews for some tracks unless the user is logged into a Spotify account.  
- **Note:** On iOS Safari, playback may be blocked due to Apple’s autoplay restrictions.

### 4. **No Location Access / GPS Issues**:
- **Fix:** Allow location permissions in your browser. If denied, the app uses a fallback location (University of North Carolina at Charlotte).
- In private browsing mode, some browsers block Geolocation APIs entirely.

### 5. **localStorage Not Persisting**:
- **Fix:** Avoid using Incognito/Private Browsing as some browsers clear `localStorage` automatically.
- Make sure browser settings don’t block third-party cookies or local data.

---

## 🔐 Login, Signup & Password Reset

RunVenture provides a lightweight local authentication system using `localStorage`. This ensures user credentials and sessions remain securely stored on the user's device without any backend or server-side dependency.

### Login (`Login.js`)
- Validates user credentials against those saved in `localStorage`.
- If the email and password match, stores the `loggedInUser` in `localStorage` and redirects to the dashboard.
- Includes a “Forgot Password?” link that navigates to the reset form.

### Signup (`Signup.js`)
- Allows new users to register with an email and password.
- Saves user data in `localStorage` under a `users` object.
- Automatically logs in the new user by setting `loggedInUser`.

### Reset Password (`ResetPassword.js`)
- Lets users update their password if their email exists in `localStorage`.
- Displays an inline success or error message based on whether the account was found.

> ⚠️ Note: This is designed for small-scale or local use only. Data is stored in `localStorage` and not backed by a secure backend or authentication system.

---

## 📊 Dashboard Overview

The `Dashboard.js` page serves as the user's personalized homepage for viewing past runs, checking monthly statistics, and launching new running sessions.

### Core Features

- **Calendar View**  
  Displays the current month with clickable days. Non-run days are left blank, and the current day is highlighted.

- **List View**  
  Toggles to a history list of all runs for the selected month. Users can delete individual runs.

- **Monthly Stats**  
  Displays total **distance**, **duration**, **calories**, and **number of workouts** for the selected month.

- **Start or Plan New Run**  
  Users can either:
  - Click **START A RUN** to begin live run tracking immediately.
  - Click **+ Plan a New Run** in the calendar to use the `RouteConditions.js` planner.

- **Run Deletion Modal**  
  Users can delete specific runs via a confirmation modal. Deleted runs are removed from both `localStorage` and the visual display.

> ⚠️ Note: All run data is pulled from `localStorage` using the current logged-in user's email. This ensures each user sees only their own run history and stats.

---

## 🗺️ FEATURE 1: Route Planning & Conditions ('RouteConditions.js')

The `RouteConditions.js` page allows users to **select a running route** directly on a map by tapping a starting point and destination. Once selected, the app presents a summary of route conditions.

### Features

- Interactive map for selecting start and end points
- Road-snapped walking path display
- Route difficulty scoring based on distance and elevation
- Randomly assigned tags for traffic level, surface type, and effort
- Route preview before confirming the run

### APIs Used

| API                          | Provider | Purpose                                               |
|-----------------------------|----------|-------------------------------------------------------|
| **Geolocation API**         | Browser  | Gets the user’s current location                      |
| **Google Maps JavaScript API** | Google   | Displays the map, markers, and polylines             |
| **Google Maps Directions API** | Google   | Snaps the route to roads using walking paths         |
| **Google Maps Elevation API**  | Google   | Retrieves elevation at the midpoint of the route     |

### How Route Data is Calculated

- **Distance** is calculated using the Haversine formula, which determines the straight-line distance between two coordinates on Earth.
- **Elevation** is fetched from the Elevation API at the midpoint of the selected route.
- **Difficulty Score** is computed by combining scaled values of distance and elevation.
- **Effort (1–10)** is a normalized score derived from the difficulty.

### Confirm and Continue

Once the user confirms the route:
- The selected start/end coordinates are saved to `localStorage`.
- The user is navigated to the **Run** page to begin live tracking on the chosen route.

> ⚠️ Note: Surface type and traffic level are currently randomly generated for demonstration purposes. Future versions may integrate real-time data from additional APIs.

---

## 🏃 FEATURE 2: Live Run Tracking with Map + Music ('Run.js')

The `Run.js` page tracks your live run, visualizes your movement on a map, and plays music through Spotify during your session.

### Features

- Live GPS tracking via your device’s Geolocation
- Live duration, distance, pace, avg pace, and calorie display
- “Hold to Finish” button to end and save your run
- Visual route mapping and markers on Google Maps
- Spotify player with playlist selection and URL loading
- Center map on current location

### APIs Used

| API                                 | Provider | Purpose                                                         |
|--------------------------------------|----------|-----------------------------------------------------------------|
| **Geolocation API**                  | W3C      | Continuously retrieves the user's live GPS coordinates          |
| **Google Maps JavaScript API**      | Google   | Renders the map, user location marker, and live run path        |
| **Google Maps Directions API**      | Google   | Displays a snapped route if a path was planned via RouteConditions |
| **Spotify Web Playback SDK / API** | Spotify  | Embeds a music player and lets users pick or load playlists     |

### How It Works

- When a user clicks **Start**, the app begins tracking time and listens for location updates.
- Each new GPS point is added to a path array, and the **distance is calculated** using the Haversine formula.
- **Calories** increase roughly every second, and **pace** is computed from the most recent distance gain.
- If a route was planned in `RouteConditions.js`, it’s retrieved from `localStorage` and drawn on the map using the **Google Directions API**, but it does not impact stats (it’s for visual reference only).
- When the user **holds down the “Hold to Finish” button**, the run is saved, and the user is redirected to view their Post-Run stats.

### Spotify Integration

- Uses Spotify's **Web Playback SDK** to embed music playback.
- Users can:
  - Play a default playlist without logging in.
  - Load any playlist via a Spotify URL.
  - Connect their Spotify account to choose personal playlists.

> ⚠️ Note: Works in desktop and mobile browsers that support Geolocation and autoplay policies for audio.

---

## 🏁 FEATURE 3: Post-Run Summary (PostRun.js)

After a run is completed, users are automatically redirected to the **PostRun** page. This page delivers a personalized breakdown of the run’s performance and recovery tips.

### Features

- Celebratory confetti animation to mark run completion  
- Summary of the most recent run: duration, distance, pace, avg pace, calories
- Recognition of personal bests (e.g., longest run this week/month, fastest pace)
- Hydration reminders based on run duration
- Two randomized post-run recovery suggestions
- One-click (X) return to the Dashboard

### How it Works

- **All run data** is retrieved from `localStorage` under the user's email.
- The **last run** is loaded and validated (must be non-zero duration).
- Performance is evaluated by comparing this run to:
  - All runs from the past 7 days (for weekly bests)
  - All runs from the past 30 days (for duration and pace analysis)
- **Hydration reminders** are calculated using this logic:
  - Runs over 40 minutes → at least 1 liter
  - Shorter runs get smaller water recommendations
- **Recovery tips** are selected randomly from a pool of motivational tips with icons.

---

## 🤝 FEATURE 4: Social Challenges ('SocialChallenges.js')

The `SocialChallenges` page lets users track fun, community-driven running goals. From logging miles to exploring parks, this feature adds motivation through friendly competition and shared progress.

### Features

- View current running challenges  
- Add custom challenges with progress tracking  
- Update progress through a modal interface  
- Mark challenges as complete with celebratory animation
- View challenge participants  
- Share challenges with others using copyable links or via socials

### How it Works

- **Add Challenge Modal** — Create a new challenge with input validation and character limit 
- **Update Progress Modal** — Log progress and track challenge status  
- **Completion Confirmation Modal** — Triggered when marking a challenge complete 
- **Participants Modal** — Shows a list of all participants for a selected challenge  
- **Share Modal** — Allows users to copy the unique challenge link or share via socials

---

## 🏋️‍♀️ FEATURE 5: Training Plans ('Training.js')

The `TrainingPlans` page provides users with personalized, editable training plans to guide their weekly running schedule. This page blends pre-defined structure with full customization to support beginner runners to marathoners.

### Features

- Switch between multiple prebuilt training plans
- Add, delete, edit, reorder, and save fitness goals for the selected plan
- View a list of recommended daily tasks for each plan
- Visualize performance trends using a graph of recent distance and calorie data
- Automatically saves all updates to `localStorage`

### How it Works

- **Goal Editing Modal** — Allows adding, editing, reordering, and deleting of goals 
- **Delete Goal Confirmation Modal** — Prevents accidental deletion  
- **Plan Selection Modal** — Switch training plans with new goal templates  
- **Performance Graph** — Updates from logged run data to show trends in distance and calories  

### Training Plans Available

| Plan Name         | Focus Area                                |
|-------------------|--------------------------------------------|
| Beginner          | Building up to a consistent 5K             |
| Intermediate      | Improving 5K time and long runs            |
| Advanced          | High-intensity intervals and long runs     |
| Trail Training    | Outdoor terrain and elevation variation    |
| Speed and Agility | Sprint-focused, explosive performance      |
| Marathon Prep     | Endurance training and weekly long runs    |

Each plan includes a full 7-day breakdown of suggested daily activities.

### Graphing and Analysis

Uses the `Recharts` library to generate a line chart showing:

- Distance (mi)
- Calories (kcal)

Data is pulled from previous runs and plotted by date.

---

## 🛣️ Future Improvements and Final Thoughts

### Future Improvements

- Integrate real-time weather, air quality, and traffic data using additional APIs
- Introduce leaderboards, badges, and streak tracking for community engagement
- Add secure backend support for user authentication and cloud-based data syncing    

### Final Thoughts

RunVenture is a reimagined fitness (run) tracker inspired by [MapMyRun.com](https://www.mapmyrun.com/). It showcases five original features, improved visual design, and a more accessible user experience. The design and development process involved analysis, prototyping, usability testing, and React.js development. This process demonstrates how user-centered design and modern development tools can improve, enhance, and reimagine an existing product or concept.

---

### 📽️ Development Process Presentation

For a detailed overview of the design and development process behind RunVenture, check out this PowerPoint:

[RunVenture_DevProcess_Presentation_Jill_Platts.pptx](./RunVenture_DevProcess_Presentation_Jill_Platts.pptx)

---

## 📄 License

See the full license terms in the [LICENSE.txt](./LICENSE.txt) file.

---

## 📬 Contact

For questions or support, email: [contactjillplatts@gmail.com](mailto:contactjillplatts@gmail.com)

## If you find this project useful, consider giving it a star! ⭐
