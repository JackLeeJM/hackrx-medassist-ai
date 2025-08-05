# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the HackRx Medical AI Assistant project - a healthcare-focused AI application designed to assist with medical queries and support.

**Important**: Refer to the `PRD.md` file in the root directory for detailed project requirements, features, and specifications. This document should be consulted for understanding the complete project scope and implementation details.

## Architecture

The project follows a standard full-stack architecture:

- **Frontend**: Located in `/frontend/` directory (currently empty, ready for implementation)
- **Backend**: Located in `/backend/` directory (currently empty, ready for implementation)
- **Root Level**: Contains project documentation and configuration

## Project Structure

```
hackrx-medassist-ai/
├── frontend/          # Frontend application (to be implemented)
├── backend/           # Backend API and services (to be implemented)
├── README.md          # Basic project information
├── LICENSE            # Project license
└── PRD                # Product Requirements Document
```

## Development Focus

**Frontend Only**: This project focuses exclusively on frontend development. Do not create any backend services, APIs, or database implementations. All functionality should be implemented as a client-side application.

## Development Status

This is a newly initialized project with placeholder directories. The frontend directory contains only a `.gitkeep` file, indicating the project is ready for frontend implementation.

## Special Permissions

The project has specific Claude Code permissions configured in `.claude/settings.local.json` allowing the use of the `find` command for file discovery.

## Important Notes

- This is a medical AI application, so ensure all implementations follow healthcare data privacy standards
- **Frontend only**: Do not implement backend services, databases, or server-side functionality
- Focus on client-side medical AI assistant features and user interface
- No specific technology stack has been chosen yet - consult with the team before making technology decisions