# DairyQuality Control

A dairy quality control management system for producers, collectors, and dairies. Track reports, analyses, and compliance data for milk quality assurance.

## Project Description

DairyQuality Control is a comprehensive mobile application designed to streamline the quality control process in the dairy industry. The app allows various stakeholders (producers, collectors, dairies) to input, track, and manage quality reports, physical-chemical analyses, antibiotic controls, pasteurization records, and adulterant summaries. Built with React Native and Expo, the application provides a seamless experience across iOS and Android devices.

## Style Guide

### Theme and Color Scheme

Our application uses a professional color scheme focused on trust and cleanliness:

- **Primary**: #3498db (Blue - represents trust and professionalism)
- **Secondary**: #2ecc71 (Green - represents freshness and quality)
- **Accent**: #9b59b6 (Purple - for highlights and special elements)
- **Background**: #f1f1f1 (Light gray - clean and neutral)
- **Surface**: #ffffff (White - for cards and content areas)
- **Text**: #2c3e50 (Dark blue-gray - high contrast and readable)
- **Text Secondary**: #7f8c8d (Gray - for secondary information)

### Spacing and Typography

- **Border Radius**: rounded-lg (8px)
- **Padding**: p-4 (16px) for main containers
- **Margin**: m-2 (8px) for element spacing

## Features

- Dashboard overview with quick stats and recent reports
- Five distinct report types:
  1. Initial Collection Reports
  2. Physical-Chemical Analysis Reports
  3. Antibiotic Control Reports
  4. Pasteurization Control Reports
  5. Adulterant Summary Reports
- Filter reports by type (Producers, Collectors, Dairies)
- Detailed view for each report type
- Professional UI with clear visual hierarchy
- Responsive design optimized for mobile devices

## Technologies Used

- React Native
- Expo
- NativeWind (Tailwind CSS for React Native)
- TypeScript
- Lucide Icons
- React Navigation

## Installation Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npx expo start
   ```

4. Run on iOS simulator:
   ```
   npx expo run:ios
   ```

5. Run on Android emulator:
   ```
   npx expo run:android
   ```

## Usage Instructions

Upon launching the app, you'll be presented with a dashboard showing:
- Recent reports across all categories
- Quick statistics on report completion
- Filter options to narrow down reports by category

Navigate between report types using the filter tabs at the top of the dashboard. Tap on any report card to view detailed information.

This initial version focuses on the dashboard interface. Additional screens for creating and viewing detailed reports will be implemented in future iterations.
```