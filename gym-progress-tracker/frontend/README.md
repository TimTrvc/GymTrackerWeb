# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Gym Progress Tracker Frontend

A modern, React-based frontend for tracking your gym workout progress with a clean, responsive UI built on best practices.

## Overview

Gym Progress Tracker is a comprehensive web application designed to help fitness enthusiasts track their workout progress. The frontend is built with React and follows clean code principles including SOLID, KISS, and DRY.

## Features

- **User Authentication**: Secure login and registration system
- **Workout Management**: Create, view, edit, and delete workout plans
- **Exercise Library**: Comprehensive database of exercises with detailed information
- **Progress Tracking**: Track your performance over time with visual statistics
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Error Handling**: User-friendly error displays and comprehensive error management

## Architecture

### Component Structure

The application follows a modular component architecture:

- **Layout Components**: `Navbar`, `Footer`, `HeroSection`
- **Auth Components**: User authentication and authorization management
- **Feature Components**: Exercise and workout management components
- **Common Components**: `ErrorDisplay`, `LoadingDisplay`
- **UI Components**: Reusable form elements and UI building blocks

### State Management

- **Context API**: `AuthContext` for centralized authentication state
- **Custom Hooks**: `useAuth`, `useForm` for reusable functionality

### Services

- **Base Service**: `BaseService` as foundation for API communication
- **Specialized Services**: 
  - `AuthService` for user authentication
  - `ExercisesService` for exercises management
  - `WorkoutService` for workout management

### Utilities

- **Error Handling**: `errorHandler` for consistent error management
- **Validation**: Form validation functions for data integrity

## Clean Code Principles

### SOLID Principles

1. **Single Responsibility**: Each component has one focused purpose
2. **Open/Closed**: Components designed for extension without modification
3. **Liskov Substitution**: Services maintain consistent interfaces
4. **Interface Segregation**: Focused APIs that provide only what's needed
5. **Dependency Inversion**: Hooks for state management and functionality

### DRY (Don't Repeat Yourself)

- Common services inherit from `BaseService`
- Reusable form components with `FormInput`, `FormButton`, etc.
- Centralized error handling with `ErrorDisplay` component

### KISS (Keep It Simple, Stupid)

- Clean, intuitive component naming
- Straightforward component structures
- Clear separation of concerns

## Usage Examples

### Error Display Component

```jsx
import ErrorDisplay from '@/components/common/ErrorDisplay';

// Different variants available
<ErrorDisplay 
  message="An error occurred" 
  onRetry={() => fetchData()} 
  variant="standard" 
/>
```

### Form Components
```jsx
import { FormInput, FormButton, FormError } from '@/components/ui/FormElements';

<FormInput
  name="username"
  label="Username"
  value={username}
  onChange={handleChange}
  error={errors.username}
/>

<FormButton isSubmitting={isLoading}>Submit</FormButton>

{errorMessage && <FormError error={errorMessage} />}
```

### Authentication 

```jsx
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, login, logout, register } = useAuth();

// Login example
const handleLogin = async () => {
  const result = await login(username, password);
  if (result.success) {
    navigate('/dashboard');
  }
};
```