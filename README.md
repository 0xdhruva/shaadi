# Shaadi.fun - Interactive Wedding Experience Platform

![Shaadi.fun Logo](public/shaadi-fun-logo.png)

Shaadi.fun is an innovative, interactive web application designed to elevate the wedding experience for Raj and Simran's guests. This full-featured platform offers a variety of engaging mini-apps and essential wedding information, all wrapped in a user-friendly interface.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Routes](#api-routes)
- [State Management](#state-management)
- [Styling](#styling)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

1. **Ashirvad Express**: 
   - Record and share 15-second video wishes for the couple
   - Utilizes device camera and microphone
   - Implements chunked video upload for better performance

2. **Shaadi Snap**: 
   - Capture 10 one-shot photos during the wedding
   - Real-time photo display and management

3. **Mauke Pe Chauka**: 
   - Interactive betting system for fun wedding events
   - Real-time odds calculation and result simulation

4. **Jodi Quiz**: 
   - Engaging quiz about the couple's relationship
   - Score tracking and result display

5. **DJ Waale Babu**: 
   - Song request system for the wedding playlist
   - Integration with YouTube API for song search

6. **Wedding Information Hub**: 
   - Detailed event schedule
   - Gift registry management
   - RSVP system with guest management

7. **Responsive Design**: 
   - Seamless experience across desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: 
  - Next.js 13 (App Router)
  - React 18
  - TypeScript 4.9+

- **Styling**: 
  - Tailwind CSS 3
  - shadcn/ui components

- **State Management**: 
  - React Context API
  - Local Storage for persistence

- **Backend**: 
  - Next.js API Routes
  - Vercel Blob Storage for video/image uploads

- **Authentication**: 
  - NextAuth.js (for admin features)

- **APIs**: 
  - YouTube Data API v3 (for song search)

- **Deployment**: 
  - Vercel Platform

## Project Structure

