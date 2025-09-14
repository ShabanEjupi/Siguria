# KoreaDrive.ks - Admin Panel Information

## Admin Panel Access

**URL:** `admin.html`

**Login Credentials:**
- **Username:** admin
- **Password:** koreadrive2024

## Features Implemented

### 1. Admin Panel Authentication
- The admin panel now requires login credentials
- Session-based authentication (valid until browser is closed or logout)
- No one can access the admin panel without proper credentials

### 2. Car Data Management
- Only your specified 6 vehicles are displayed:
  1. BMW 5 Series (F10) - €8,656 - 2015 - Diesel
  2. BMW 5 Series (F10) 528i - €9,200 - 2015 - Benzinë  
  3. BMW i3 - €8,840 - 2015 - Elektrike
  4. Mercedes C-Class W205 C220d Coupe - €15,880 - 2017 - Dizel
  5. BMW 3 Series (F30) 320d - €7,440 - 2015 - Dizel
  6. BMW 3 Series GT (F34) GT 320d - €8,400 - 2015 - Dizel

### 3. Data Reset
- Used `reset-cars.html` to clear old data and initialize with new cars
- All other vehicles have been removed from both the cars page and admin panel

## Files Modified

1. **admin.html** - Added login form and authentication system
2. **cars.html** - Updated to load only specified vehicles
3. **index.html** - Updated to load only specified vehicles
4. **car-details.html** - Updated to support new car data
5. **init-cars.js** - New file with your specified car data
6. **reset-cars.html** - Utility page to reset car data

## How to Change Admin Credentials

Edit the `admin.html` file around line 872-873:
```javascript
const validUsername = 'admin';
const validPassword = 'koreadrive2024';
```

## Security Notes

- The current authentication is client-side only (suitable for basic protection)
- For production use, consider server-side authentication
- Sessions are stored in browser sessionStorage (cleared when browser closes)

## Support

Contact the developer for any issues or additional modifications needed.
