1. Initial project setup (manually):
   - Bootstrapped with Vite + React + TypeScript
   - Installed dependencies: react, react-dom, react-router-dom, @reduxjs/toolkit, react-redux, tailwindcss, lucide-react
   - Configured ESLint and Prettier for code style and linting.
   - Created project file structure (components, pages, store, services, types directories).
   - Set up Tailwind CSS and configured theme/styles.
2. Feed the requirement from notion to chat, to generate plan.
3. Implement the plan -> get the basic working code for searching and displaying details.
4. Refine some ui details manually.
5. Add functionality to display initial anime data during initial load:
   - **context**: anime list page and filter component
   - **prompt**: "Now I want to display the top anime data in the UI when the user first loads the page. If the user has already searched for an anime, display the search results."
   - **result**: get the working code to display initial anime data, and does some manual fixing since the result made the search not working.
6. Add functionality to enasble user to filter the anime data by status, type, and rating.
   - **context**: anime list page and filter component
   - **prompt**: "Now I want to enable user to be able to filter anime base of its status, type, and rating. here are the option for those filters
     status: "airing" "complete" "upcoming"
     type: "tv" "movie" "ova" "special" "ona" "music" "cm" "pv" "tv_special"
     rating: "g" "pg" "pg13" "r17" "r" "rx""
   - **result**: get the working code to enable user to filter anime base of its status, type, and rating. Still need to fix the UI manually, since the generated layout was not usable on mobile or smaller screens.
7. Add dialog to warn user about the NSFW content.
   - **context**: anime list page and filter component
   - **prompt**: "Now since we already have filter, and filter by rating include an NSFW or adult content. I want to add warning or precaution when user selecting those option as filter.
     so display a warning dialog that state the content might contain NSFW content. and only proceed if they check the understand, and state they are above 18. store this state on the browser so we didn't need to ask everytime."
   - **result**: get the working code to add a dialog to warn user about the NSFW content. This work garcefully in one shot. so justr need to confirm the functionality.
