# LVA Studio Member Portal

A React-based member portal for LVA Studio with role-based access control and application management.

## Features

### Role-Based Navigation
- **Admin Role**: Users with "Admin" role in the "Main" CMS can access the Admin panel
- **Client Role**: Users with "Client" role can access the Projects page
- **Member Role**: Standard users can access Home, My Account, and Application pages

### Admin Panel (`/admin`)
- View all applications from the "Applications" CMS
- Filter applications by status (New, Pending, Approved)
- Approve applications (changes status to "Approved")
- Set applications to Pending (changes status to "Pending")
- Remove applications from the CMS
- Real-time status updates

### Projects Page (`/projects`)
- View user's own submitted applications
- Track application progress and status
- Filter by application status
- Detailed view of application information
- Next steps information for approved applications

### Application Management
- Submit new applications with status "New"
- Applications are stored in the "Applications" CMS
- Status tracking: New → Pending → Approved
- Role-based access control

## Message Types for Wix Integration

### From React to Wix
- `getApplications` - Request all applications (Admin only)
- `getMyApplications` - Request user's applications (Client only)
- `updateApplicationStatus` - Update application status
- `deleteApplication` - Remove application from CMS
- `saveApplication` - Submit new application

### From Wix to React
- `applicationsData` - Return all applications data
- `myApplicationsData` - Return user's applications data
- `applicationUpdateSuccess` - Status update successful
- `applicationUpdateError` - Status update failed
- `applicationDeleteSuccess` - Application removal successful
- `applicationDeleteError` - Application removal failed

## Setup Instructions

1. Ensure the "Main" CMS has a `role` field with values: "Admin", "Client", "Member"
2. Ensure the "Applications" CMS has a `status` field with values: "New", "Pending", "Approved"
3. Implement the message handlers in Wix Velo to handle the CMS operations
4. Deploy the React application and embed it in your Wix site

## File Structure

```
src/
├── components/
│   ├── Admin.jsx          # Admin panel component
│   ├── Admin.css          # Admin panel styles
│   ├── Projects.jsx       # Projects page component
│   ├── Projects.css       # Projects page styles
│   ├── Navigation.jsx     # Updated navigation with role-based links
│   └── ...                # Other existing components
├── App.jsx                # Updated with new routes
└── main.jsx              # Entry point
```

## Dependencies

- React 19.1.1
- React Router DOM 7.8.0
- Vite for build tooling

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The built files will be in the `dist/` directory and can be deployed to your hosting platform.
