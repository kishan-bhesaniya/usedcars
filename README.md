# UsedCars

[https://www.loom.com/share/7833813ae0e24ecb89092439e2cc7edb](https://www.loom.com/share/7833813ae0e24ecb89092439e2cc7edb)

🔗 Live Demo: https://usedcars7.vercel.app/
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

| Feature                      | Implementation                                                   |
| ---------------------------- | ---------------------------------------------------------------- |
| **Multi-criteria Filtering** | `filterAndSortCars()` applies multiple conditions simultaneously |
| **Smart Sorting**            | Sort by price, year, or kilometers using `sort` state            |
| **Responsive Design**        | Tailwind CSS breakpoints; separate desktop/mobile filter UIs     |
| **Performance**              | React.useMemo prevents unnecessary re-renders and recalculations |
| **Loading States**           | Skeleton loaders and loading states for better UX                |
| **Search**                   | Real-time search filtering by model or brand name                |
| **Error Handling**           | Not-found pages for missing car details                          |

### Routing Architecture

- **Routes**:
  - `/` → Dashboard (home page)
  - `/car` → Cars listing page (canonical)
  - `/cars` → Redirects to `/car`
  - `/car-details/:carId` → Car details page
  - `/cars-details/:carId` → Alias for car details
  - `*` → Fallback to home page

### Build & Development

- **Development**: `npm run dev` starts Vite dev server with hot module reloading
- **Production**: `npm run build` creates optimized bundle
- **Linting**: `npm run lint` enforces code quality with ESLint
- **Preview**: `npm run preview` serves production build locally

This architecture prioritizes **simplicity, performance, and maintainability** while providing a modern, responsive user experience for car shopping.
