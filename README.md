# Dental Center Management Dashboard

A modern React-based dental center management system for ENTNT Technical Assignment. Features role-based access, patient management, appointment scheduling, and file handling with a professional Material-UI interface.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Running
```bash
# Clone the repository
git clone https://github.com/Maver1ck123/dental-center-dashboard.git
cd dental-center-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

### Demo Accounts
- **Admin**: `admin@entnt.in` / `admin123` (Full Access)
- **Patient**: `john@entnt.in` / `patient123` (Patient View)

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production
```bash
npm run build
npm run serve  # Optional: serve build locally
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard-specific components
│   ├── Incidents/      # Appointment/incident management
│   ├── Layout/         # Layout and navigation
│   └── Patients/       # Patient management components
├── context/            # React Context providers
├── pages/              # Main page components
├── theme/              # Custom Material-UI theme
└── utils/              # Utility functions and localStorage
```

### Technology Stack
- **Frontend Framework**: React 19.1.0 with functional components and hooks
- **UI Library**: Material-UI 7.1.2 with custom theming
- **Routing**: React Router DOM 7.6.3 with protected routes
- **State Management**: React Context API
- **Data Persistence**: localStorage (simulating backend)
- **Date Handling**: date-fns with MUI date pickers

### Component Architecture
- **Functional Components**: Modern React with hooks for state management
- **Context Providers**: Separate contexts for Auth and Data management
- **Protected Routes**: Role-based access control at route level
- **Reusable Components**: Modular design with prop-based customization

### Data Flow
1. **Authentication**: Login validation → Context storage → Route protection
2. **Data Management**: CRUD operations → Context updates → localStorage sync
3. **File Handling**: File upload → Base64 conversion → Storage with metadata

## � Technical Decisions

### Framework & Library Choices
- **React**: Chosen for component-based architecture and rich ecosystem
- **Material-UI**: Selected for professional medical UI and built-in accessibility
- **Context API**: Sufficient for app scale, avoiding Redux complexity
- **localStorage**: Simulates backend persistence for frontend-only demo

### State Management Strategy
- **Separate Contexts**: AuthContext for user state, DataContext for application data
- **Optimistic Updates**: Immediate UI feedback with rollback capabilities
- **Data Normalization**: Structured data models for patients and appointments

### File Upload Implementation
- **Base64 Encoding**: Client-side file processing for demo purposes
- **Drag-and-Drop**: Native HTML5 API with custom styling
- **Validation**: File type and size restrictions for security

### UI/UX Decisions
- **Custom Theme**: Professional gradient-based design for medical context
- **Responsive Design**: Mobile-first approach with breakpoint considerations
- **Role-Based Views**: Different interfaces for admin vs patient users
- **Progressive Enhancement**: Core functionality works without JavaScript

## � Known Issues & Limitations

### Current Issues
1. **File Storage Limitations**
   - Large files (>10MB) may cause browser performance issues
   - localStorage has 5-10MB limit depending on browser

2. **Data Persistence**
   - Data lost when browser storage is cleared
   - No backup or sync mechanism

3. **Concurrency**
   - No real-time updates between browser tabs/sessions
   - Potential data conflicts with multiple admin users

4. **Search & Filtering**
   - Basic search functionality in current implementation
   - No advanced filtering or sorting options

### Browser Compatibility
- **Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Limited Support**: Internet Explorer (not recommended)

### Performance Considerations
- **Large Datasets**: UI may slow with 100+ patients/appointments
- **File Previews**: Image loading may delay with multiple large files
- **Memory Usage**: Base64 encoding increases memory footprint

## 🚀 Deployment

### Production Build
```bash
npm run build
```

**Note**: This is a frontend-only demonstration. All data is stored locally and no real medical information should be used.