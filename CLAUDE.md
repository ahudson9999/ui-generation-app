# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server (with Turbopack)
- `npm run dev:daemon` - Start development server in background, logs to logs.txt
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing & Quality
- `npm test` - Run tests with Vitest
- `npm run lint` - Run ESLint

### Database
- `npm run setup` - Install dependencies, generate Prisma client, and run migrations
- `npm run db:reset` - Reset database (force migrate reset)

## Architecture

### Core Concept
UIGen is an AI-powered React component generator with live preview. The application uses a virtual file system that exists only in memory/database - no files are written to disk during development.

### Key Technologies
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Prisma** with SQLite for data persistence
- **Anthropic Claude AI** via Vercel AI SDK for component generation
- **Monaco Editor** for code editing
- **Vitest** for testing

### Application Flow
1. **Authentication**: Users can sign up/in or use anonymous mode
2. **Project Management**: Authenticated users get persistent projects; anonymous users work in memory
3. **Chat Interface**: Users describe components they want via natural language
4. **AI Generation**: Claude generates React components using custom tools
5. **Virtual File System**: All generated code exists in a VirtualFileSystem class
6. **Live Preview**: Components are rendered in real-time using dynamic imports and Babel compilation
7. **Code Editor**: Full Monaco editor integration for manual code editing

### Core Components

#### Virtual File System (`/src/lib/file-system.ts`)
- `VirtualFileSystem` class manages all files in memory
- Supports file operations: create, read, update, delete, rename
- Implements text editor commands for AI tools
- Serializes/deserializes for database persistence

#### Context Providers
- `FileSystemProvider` (`/src/lib/contexts/file-system-context.tsx`) - Manages virtual file state
- `ChatProvider` (`/src/lib/contexts/chat-context.tsx`) - Handles AI chat and tool calls

#### AI Integration (`/src/app/api/chat/route.ts`)
- Uses Vercel AI SDK with Anthropic provider
- Custom tools: `str_replace_editor` and `file_manager` for file manipulation
- Streams responses with tool calling for real-time file updates
- Persists chat and file state to database for authenticated users

#### UI Layout (`/src/app/main-content.tsx`)
- Resizable panel layout with chat, preview, and code views
- Tabbed interface switching between Preview and Code modes
- Code mode shows file tree + Monaco editor

#### Preview System (`/src/components/preview/PreviewFrame.tsx`)
- Renders generated components in isolated iframe
- Uses Babel standalone for JSX compilation
- Hot reloads when files change

### Database Schema
- `User` - Authentication (email/password with bcrypt)
- `Project` - Stores serialized messages and file system data
- Projects can be anonymous (no userId) or authenticated

### Development Notes
- Uses path alias `@/*` for `/src/*`
- Vitest configured with jsdom for component testing
- ESLint with Next.js config
- Anthropic API key optional - falls back to mock responses
- Development server runs on port 3000 (or next available)