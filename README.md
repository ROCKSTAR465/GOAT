# The GOAT Media - Employee Dashboard System

A comprehensive role-based employee dashboard system built with Next.js 14, TypeScript, and Tailwind CSS for The GOAT Media's AI SaaS platform.

## 🚀 Features

### Role-Based Access Control
- **Creative Team Members**: Script management, shoot scheduling, editing queue, time tracking
- **Project Managers**: Team workload overview, project timelines, resource allocation
- **Social Media Managers**: Publishing calendar, content performance, hashtag management
- **Finance Team**: Budget tracking, payment monitoring, cost analysis, financial KPIs

### Core Dashboard Components
- **My Tasks Hub**: Unified task management with time tracking for all roles
- **Role-Specific Widgets**: Customized dashboards for each employee type
- **Real-time Updates**: Live data synchronization and notifications
- **Mobile Responsive**: Touch-optimized interface for all devices

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/UI components
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 🔐 Authentication

### Login Credentials
- **Creative Team**: `creative` / `creative`
- **Project Manager**: `manager` / `manager`
- **Social Media Manager**: `social` / `social`
- **Finance Team**: `finance` / `finance`

### Features
- Role selection with automatic credential filling
- Session management with localStorage
- Automatic dashboard routing based on role
- Secure logout functionality

## 📱 Dashboard Views

### Creative Team Dashboard
- Active scripts with progress tracking
- Today's shoot schedule
- Pending edits queue with priority levels
- Time tracking integration
- Quick access to editing tools

### Project Manager Dashboard
- Multi-client project overview
- Team workload and capacity monitoring
- Upcoming deadlines and alerts
- Resource allocation planning
- Project status tracking

### Social Media Manager Dashboard
- Publishing queue calendar
- Platform performance metrics
- Hashtag performance tracking
- Content ideas and strategy
- Multi-platform management

### Finance Team Dashboard
- Client budget overview
- Payment status monitoring
- Cost breakdown by category
- Financial KPI tracking
- Invoice management

## 🏗️ Project Structure

```
app/
├── dashboard/
│   ├── creative/          # Creative Team Dashboard
│   ├── manager/           # Project Manager Dashboard
│   ├── social/            # Social Media Manager Dashboard
│   ├── finance/           # Finance Team Dashboard
│   └── layout.tsx         # Role-based routing
├── login/
│   └── page.tsx           # Role selection & authentication
└── globals.css            # Global styles

components/
├── dashboard/
│   ├── app-sidebar.tsx    # Role-specific navigation
│   ├── site-header.tsx    # Role-aware header
│   └── sections/
│       └── MyTasksHub.tsx # Unified task management
└── ui/                    # Reusable UI components
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd GOAT-dashboard-main

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_APP_NAME="The GOAT Media"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Customization
- Modify role-specific navigation in `components/dashboard/app-sidebar.tsx`
- Update dashboard content in respective role pages
- Customize styling in `app/globals.css`

## 📊 Data Integration

### Current Implementation
- Mock data for demonstration purposes
- Local storage for user sessions
- Role-based data filtering

### Future Integrations
- REST API connections to backend systems
- Real-time WebSocket updates
- Google Calendar API integration
- Adobe Premiere Pro plugin integration
- WhatsApp Business API for notifications

## 🎨 Design System

### Color Scheme
- **Creative Team**: Blue theme
- **Project Manager**: Green theme  
- **Social Media**: Purple theme
- **Finance Team**: Orange theme

### Components
- Consistent card layouts with BorderBeam effects
- Responsive grid systems
- Interactive hover animations
- Progress bars and status indicators
- Badge system for priority and status

## 📱 Mobile Responsiveness

- Touch-optimized interface
- Responsive grid layouts
- Mobile-friendly navigation
- Optimized for tablets and phones

## 🔒 Security Features

- Role-based route protection
- Session timeout handling
- Secure logout functionality
- Input validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=out
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary software for The GOAT Media.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial role-based dashboard system
- Four employee role dashboards
- Unified task management system
- Mobile-responsive design
- Authentication system

---

**Built with ❤️ for The GOAT Media Team**

