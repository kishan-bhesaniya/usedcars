# UsedCars

UsedCars is a simple car browsing web app that helps customers explore available used cars in one place.

This product is designed to make car discovery easy. A user can open the website, search for a car, filter the inventory, compare options quickly, and open a full detail page for any vehicle they are interested in.

## What This Product Does

- Shows a clean home page with a featured car and quick access to the inventory.
- Lets users browse a list of available used cars.
- Helps users search by car model or brand.
- Lets users filter cars by price, year, kilometers driven, brand, body type, fuel type, transmission, ownership, and status.
- Lets users sort results by price, registration year, and kilometers driven.
- Opens a dedicated car details page with photos and key specifications.

## Main Pages

### 1. Home Page

The home page introduces the product and gives users a quick starting point.

Users can:

- Explore the car inventory
- Search for a specific model
- View a featured car

### 2. Cars Listing Page

This page displays the available cars in the inventory.

Users can:

- Browse all cars
- Apply filters to narrow results
- Sort cars based on their preference

### 3. Car Details Page

This page gives full information about one selected car.

Users can:

- View car images
- Check the price
- See registration year
- View fuel type
- Check transmission
- See kilometers driven
- Review body type and other important details

## Who This Product Is For

This product is useful for:

- Customers looking to buy a used car
- Businesses that want a simple used-car catalog experience

## Summary

UsedCars is a user-friendly used car browsing platform that helps people search, filter, and view car details in a simple and organized way.

## Architecture Explanation

### Technology Stack

- **Frontend Framework**: React 19 with Vite (fast build tool and development server)
- **Routing**: React Router v7 (client-side routing for multi-page navigation)
- **Styling**: Tailwind CSS v4 with responsive design utilities
- **UI Components**: shadcn/ui (accessible, customizable component library built on Radix UI)
- **Data Visualization**: Recharts (for charts and data visualization)
- **State Management**: React Hooks (useState, useMemo for local state and performance optimization)
- **Form Validation**: Zod (runtime type checking)
- **Drag & Drop**: @dnd-kit (sortable, draggable components)
- **Icons**: Lucide React (modern icon library)
- **Notifications**: Sonner (toast notifications)

### Project Structure

```
src/
├── pages/              # Page components (full page views)
│   ├── dashboard.jsx   # Home page with featured car
│   ├── cars.jsx        # Car listing page with filters & sorting
│   └── cars-details.jsx # Individual car detail view
├── components/         # Reusable UI components
│   ├── ui/             # Basic UI building blocks (Button, Card, Input, etc.)
│   ├── car-card.jsx    # Car listing card component
│   ├── cars-filter-sidebar.jsx # Filter panel for desktop
│   ├── header.jsx      # Navigation header
│   ├── footer.jsx      # Page footer
│   ├── cars/           # Car listing related components
│   │   ├── cars-toolbar.jsx      # Sort & search controls
│   │   ├── cars-results.jsx      # Results grid/list display
│   │   ├── cars-loading-state.jsx # Loading skeleton
│   │   └── cars-mobile-filters.jsx # Mobile filter view
│   └── car-details/    # Car detail page components
│       ├── car-details-gallery.jsx # Image gallery
│       ├── car-details-overview.jsx # Key info section
│       ├── car-details-summary.jsx # Price & main details
│       ├── car-details-similar-cars.jsx # Related vehicles
│       ├── detail-item.jsx         # Individual spec display
│       ├── car-details-skeleton.jsx # Loading state
│       └── car-details-not-found.jsx # Error state
├── lib/                # Utility functions & business logic
│   ├── cars.js         # Car data fetching & image URL helpers
│   ├── car-filters.js  # Filter logic, sorting, metadata building
│   ├── car-details.js  # Car detail page utilities
│   ├── site.js         # Global site utilities
│   └── utils.js        # General helper functions
├── hooks/              # Custom React hooks
│   └── use-page-loading.js # Hook for managing page loading state
├── App.jsx             # Main app routing & layout
└── main.jsx            # React DOM entry point
```

### Data Flow Architecture

1. **Data Source**: 
   - Static JSON data (`cars.json`) containing car inventory
   - Component configuration (`components.json`)

2. **Car Listing Flow**:
   ```
   CarsPage (loads cars.json)
     ├─ CarsFilterSidebar (Desktop filters)
   ├─ CarsMobileFilters (Mobile filters)
     ├─ CarsToolbar (Sort & search)
     └─ CarsResults (Filtered car display)
        └─ CarCard (Individual card)
   ```

3. **Filtering & Sorting**:
   - User selects filters (price range, brand, fuel type, etc.)
   - `car-filters.js` applies filters and sorting logic
   - `useMemo` optimizes performance by memoizing filtered results
   - Results update in real-time as filters change

4. **Car Details Flow**:
   ```
   CarsDetailsPage (loads single car data)
     ├─ CarDetailsGallery (Image display)
     ├─ CarDetailsOverview (Specs table)
     ├─ CarDetailsSummary (Price & basic info)
     └─ CarDetailsSimilarCars (Recommendations)
   ```

### Key Features & Implementation

| Feature | Implementation |
|---------|-----------------|
| **Multi-criteria Filtering** | `filterAndSortCars()` applies multiple conditions simultaneously |
| **Smart Sorting** | Sort by price, year, or kilometers using `sort` state |
| **Image Handling** | Dynamic image URL extraction supporting multiple formats (nested objects, arrays) |
| **Responsive Design** | Tailwind CSS breakpoints; separate desktop/mobile filter UIs |
| **Performance** | React.useMemo prevents unnecessary re-renders and recalculations |
| **Loading States** | Skeleton loaders and loading states for better UX |
| **Search** | Real-time search filtering by model or brand name |
| **Error Handling** | Not-found pages for missing car details |

### State Management Strategy

The application uses **local component state** with React Hooks:

- **Filters State** (`cars.jsx`): Centralized filter object containing:
  - Price range (minPrice, maxPrice)
  - Selected brands, body types, fuel types, etc.
  - Sort preference
  - Search query

- **Performance Optimization**: 
  - `useMemo` hooks cache expensive operations
  - `useState` with functional updates prevent stale closures
  - Component splitting prevents unnecessary re-renders

### Routing Architecture

- **Routes**:
  - `/` → Dashboard (home page)
  - `/car` → Cars listing page (canonical)
  - `/cars` → Redirects to `/car`
  - `/car-details/:carId` → Car details page
  - `/cars-details/:carId` → Alias for car details
  - `*` → Fallback to home page

- **Implementation**: React Router v7 for SPA navigation without page reloads

### UI Component Architecture

Built with **shadcn/ui** patterns:
- Composable, unstyled component primitives
- Radix UI under the hood for accessibility
- Tailwind CSS for styling
- Class-variance-authority for variant management
- Full customization while maintaining consistency

### Build & Development

- **Development**: `npm run dev` starts Vite dev server with hot module reloading
- **Production**: `npm run build` creates optimized bundle
- **Linting**: `npm run lint` enforces code quality with ESLint
- **Preview**: `npm run preview` serves production build locally

This architecture prioritizes **simplicity, performance, and maintainability** while providing a modern, responsive user experience for car shopping.
