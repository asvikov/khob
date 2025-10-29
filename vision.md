# Technical Vision

## Technologies

- **Database**: PostgreSQL
- **Backend**: PHP (Laravel Framework)
- **Frontend**: JavaScript (React.js), CSS (custom styles and bootstrap.css), SCSS
- **Dependency Management**: Composer for PHP, NPM for frontend
- **Testing**: Feature and Unit tests built into Laravel (khob/tests/)

## Development Principles

- **KISS** - Keep it simple, stupid
- **MVP Approach** - Developing a product with minimal but viable feature set that allows testing the core idea with real users and getting feedback
- **Iterative Development** - Small increments with fast feedback loops
- **Early Testing** - Starting testing as early as possible in the development lifecycle helps identify and fix defects

## Project Structure

```
khob/
|--public/
|  |--index.php # Application entry point
|--.env # Main Laravel configuration file
|--config/ # Laravel configuration files
|--database/
|  |--factories/ # Factories
|  |--migrations/ # Database migrations
|--routes/
|  |--web.php # Routing for loading React.js framework (frontend)
|  |--api.php # Routing for API endpoints (backend), all API routes are located at url khob.test/api/{*}
|--storage/
|  |--app/
|     |--public/ # Directory for storing public files
|        |--img/ # Directory for public images
|--tests/
|  |--Feature/ # Backend feature tests
|  |--Unit/ # Backend unit tests
|--vendor/ # Laravel framework system files and other packages
|--resources/
|  |--css/ # CSS style files for frontend
|  |--scss/
|     |--custom.scss # Style file where all custom styles are added, which are then compiled into the main CSS file
|  |--views/
|     |--welcome.blade.php # Laravel template file from which the main React app.js file is loaded
|  |--js/
|     |--src/ # Directory with React files
|        |--app.js # Main React file (entry point)
|        |--svg/ # SVG image files
|        |--services/ # Directory for custom service files for React (with subdirectories if needed)
|        |--hooks/ # Directory for custom hook files
|        |--components/
|           |--Main.jsx # Main component file for the regular user frontend part (url: khob.test/{*} except khob.test/admin/{*})
|           |--auth/ # Authentication and registration components
|           |--navigation/ # Site navigation components (menu)
|           |--occasions/ # Components for displaying and working with events (occasion)
|           |--users/ # Components for displaying and working with user information
|           |--admin/ # Directory for administrative panel components (khob.test/admin/{*})
|              |--navigation/ # Navigation components for the admin section (menu)
|              |--users/ # Components for displaying and working with user information
|              |--Dashboard.jsx # Admin panel dashboard
|              |--MainAdmin.jsx # Main component file for the admin frontend part (khob.test/admin/{*})
```

## Code Conventions

### What NOT to do

- Complex architecture without necessity
- Asynchronous functions without necessity
- Excessive abstractions
- Using third-party packages/libraries when a custom solution is possible
- Excessive functionality, meaning functions that won't be used at this stage

### What to do

- Simple functions and minimal classes when possible
- Single responsibility: one file - one responsibility, one class - one responsibility
- Clear (meaningful) variable and function names