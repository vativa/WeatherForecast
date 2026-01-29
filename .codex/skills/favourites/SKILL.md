---
name: Favourite Location
description: Persist favourite locations on page refresh, list under SearchBar, and fetch weather on click.
---

# Task: Create functionality for keeping favaoute locations
- Create sticky navbar on top of the site having a "Favourites" button (preferably using Heart icon, keep right).
- Extend Redux store to create actions when interacting with weather forecast buttons/cards.
- Please persist favourite entries in local storage so that they are available on page reload/refresh.
- Clicking on "Favourites" button in the navbar should list all favourite locations under the SearchBar component.
- Each favourite entry listed should be clickable, on click triggers "Get Location" button logic, and fetching/rendering weather results for that location.

# Task: Autorefresh with predefined interval 15, 30, 60 minutes
- Please add predefined interval list with mentioned count of minutes.
- Custom interval should be supported to add to the bottom of predifined intervals.
- Add intervals to the Redux store in their own slice/object.
- Always use current location from the Redux store to fetch weather data.
- Add autorefresh logic to fetch weather data for the current location based on selected interval.
- Each custom interval entry has a "X" delete button to remove it from the list.
- Activating a timer without current location will result in empty expectations by the user.
- Please notify the user about missing curent location with warning.
- Do not activate auto refresh interval without current location.

# Code Standards
- Keep files under 100 lines where possible.
- DRY - Don't Repeat Yourself.
