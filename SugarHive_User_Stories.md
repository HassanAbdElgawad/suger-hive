# SugarHive - User Stories

**Document Version:** 1.0
**Date:** February 25, 2026
**Project Name:** SugarHive - Operational Management System

---

## Epic 1: Authentication & Onboarding

### US-1.1: User Login
**As a** registered user,
**I want to** sign in with my email and password,
**So that** I can access the platform and see my assigned tasks.

**Acceptance Criteria:**
- User enters email and password on the login page
- System validates credentials and redirects to the Dashboard
- Invalid credentials show an error message
- Session persists across browser refreshes

---

### US-1.2: Invite-Based Registration
**As an** Admin,
**I want to** generate a unique invite code with a pre-assigned role and branch,
**So that** new team members can register with the correct permissions from the start.

**Acceptance Criteria:**
- Admin selects a role and branch when generating the invite
- System creates a unique 6-character alphanumeric code
- A shareable registration link is generated (e.g., `/register/ABC123`)
- Each invite code can only be used once

---

### US-1.3: New User Registration
**As a** new employee,
**I want to** register using the invite code I received,
**So that** I can create my account and start using the platform.

**Acceptance Criteria:**
- User enters their name, email, password, and invite code
- System validates the invite code and assigns the pre-defined role and branch
- Account is created and user is redirected to the Dashboard
- Used invite code is marked as consumed and cannot be reused

---

### US-1.4: User Logout
**As a** logged-in user,
**I want to** sign out of the platform,
**So that** my session is ended and my account is secure.

**Acceptance Criteria:**
- User clicks "Sign Out" in the sidebar
- Session is cleared and user is redirected to the login page

---

## Epic 2: Operations Dashboard

### US-2.1: View Dashboard Summary
**As a** user,
**I want to** see a summary of key operational metrics on the Dashboard,
**So that** I can quickly understand the current state of operations.

**Acceptance Criteria:**
- Dashboard shows Completed Tasks, Pending Tasks, Active Users, and Overdue Tasks counts
- Data is filtered by the user's branch (non-admin users see only their branch)
- Admins see data across all branches

---

### US-2.2: View Live Operations Feed
**As a** Manager or Admin,
**I want to** see a real-time feed of checklist activity,
**So that** I can monitor what's happening across branches right now.

**Acceptance Criteria:**
- Feed shows recent checklist completions with user name, branch, progress, and time
- Feed can be filtered between "All" and "Active" tabs
- Feed updates reflect the latest checklist activity

---

### US-2.3: View Training Hub Summary
**As a** user,
**I want to** see a quick overview of training course progress on the Dashboard,
**So that** I can track learning activity at a glance.

**Acceptance Criteria:**
- Training Hub card displays course names with completion status
- Shows progress bars and "Completed" / "In Progress" labels
- Links to the full Training page for more details

---

### US-2.4: View Operational Logs
**As an** Admin,
**I want to** see a chronological log of all operational events,
**So that** I can audit activity and track changes over time.

**Acceptance Criteria:**
- Logs display event descriptions with timestamps, users, and branches
- Logs are listed in reverse chronological order

---

### US-2.5: Export Operational Logs
**As an** Admin,
**I want to** export operational logs as a CSV file,
**So that** I can analyze the data externally or share it with stakeholders.

**Acceptance Criteria:**
- "Export as CSV" button generates a downloadable CSV file
- CSV includes all log entries with relevant columns (date, time, user, event, branch)

---

## Epic 3: Checklist Management

### US-3.1: Create Checklist Template
**As an** Admin,
**I want to** create a new checklist template with title, frequency, branch, assignee, and time window,
**So that** recurring operational tasks are standardized across branches.

**Acceptance Criteria:**
- Form includes fields for title, frequency (Daily/Weekly/Monthly), start/end date, start/end time, branch, and assignee
- New checklists are saved in "Draft" status by default
- Checklist appears in the "Drafts" tab after creation

---

### US-3.2: Publish a Draft Checklist
**As an** Admin,
**I want to** publish a draft checklist,
**So that** it becomes visible and actionable for the assigned team members.

**Acceptance Criteria:**
- Published checklists move from the "Drafts" tab to the "Active" tab
- Assigned users can now see and interact with the checklist
- Notifications are sent to assigned users

---

### US-3.3: Unpublish a Checklist
**As an** Admin,
**I want to** unpublish an active checklist and revert it to draft,
**So that** I can make changes before making it visible again.

**Acceptance Criteria:**
- Checklist returns to "Draft" status
- Checklist is no longer visible to non-admin users
- Existing completion data is preserved

---

### US-3.4: View Checklists by Status
**As a** user,
**I want to** filter checklists by status (All, Active, Completed, Overdue, Drafts),
**So that** I can focus on the checklists that need my attention.

**Acceptance Criteria:**
- Tabs display counts for each status category
- Clicking a tab filters the checklist list accordingly
- "Drafts" tab is only visible to Admins

---

### US-3.5: Complete Checklist Items
**As a** Supervisor or Employee,
**I want to** mark individual checklist items as Complete, Partial, or Incomplete,
**So that** I can accurately report the status of each task.

**Acceptance Criteria:**
- Each item has buttons/controls for the three completion states
- Overall checklist progress percentage updates in real time
- Changes are saved immediately

---

### US-3.6: Attach Photo Evidence
**As a** Supervisor or Employee,
**I want to** attach a photo to a checklist item,
**So that** I can provide visual evidence that a task was completed.

**Acceptance Criteria:**
- Camera/upload button is available on each checklist item
- Uploaded photo is displayed as a thumbnail next to the item
- Photo is saved and visible in the history record

---

### US-3.7: Add Comments to Checklist Items
**As a** Supervisor or Employee,
**I want to** add a text comment to a checklist item,
**So that** I can note any issues, observations, or follow-ups.

**Acceptance Criteria:**
- Text input field is available on each checklist item
- Comments are saved and visible in the history record
- Comments are attributed to the user who wrote them

---

### US-3.8: Complete All / Reset All Items
**As a** user,
**I want to** mark all items as complete or reset all items at once,
**So that** I can save time on checklists with many items.

**Acceptance Criteria:**
- "Complete All" button sets all items to Complete status
- "Reset All" button clears all item statuses
- Progress percentage updates accordingly

---

### US-3.9: Auto-Overdue Detection
**As a** Manager or Admin,
**I want** checklists to be automatically marked as "Overdue" when they pass their end time without completion,
**So that** I can identify missed tasks without manual monitoring.

**Acceptance Criteria:**
- System checks checklist end times against current time
- Incomplete checklists past their end time display "Overdue" status badge
- Overdue checklists appear in the "Overdue" tab

---

### US-3.10: View Checklist History
**As a** Manager or Admin,
**I want to** review the completion history of a checklist,
**So that** I can audit past performance and verify compliance.

**Acceptance Criteria:**
- History shows each completion record with date, time, and user
- Each record includes item-level status, photos, and comments
- History is accessible from the checklist detail view

---

### US-3.11: Add Tasks to Existing Checklist
**As an** Admin,
**I want to** add new tasks to an existing checklist template,
**So that** I can update checklists as operational requirements change.

**Acceptance Criteria:**
- "Add Task" button opens input for new task text
- Tasks can be tagged with categories
- New tasks appear in the checklist immediately

---

### US-3.12: Edit Checklist Template
**As an** Admin,
**I want to** edit the details of an existing checklist (title, frequency, assignee, etc.),
**So that** I can keep checklists up to date without recreating them.

**Acceptance Criteria:**
- Edit dialog pre-fills with current checklist values
- Changes are saved and reflected immediately
- Active checklists can be edited without disrupting in-progress completions

---

### US-3.13: Delete Checklist Template
**As an** Admin,
**I want to** delete a checklist template,
**So that** outdated or irrelevant checklists are removed from the system.

**Acceptance Criteria:**
- Confirmation dialog appears before deletion
- Deleted checklists are permanently removed
- Associated history data is handled appropriately

---

## Epic 4: Training Center

### US-4.1: Create Training Course
**As an** Admin,
**I want to** create a training course with title, description, category, instructor, duration, and cover image,
**So that** I can build a structured learning program for staff.

**Acceptance Criteria:**
- Form captures all required course metadata
- Course appears in the course list after creation
- Cover image is displayed on the course card

---

### US-4.2: Add Lessons to Course
**As an** Admin,
**I want to** add multiple lessons to a course, each with a title and optional multimedia attachment,
**So that** training content is organized into digestible units.

**Acceptance Criteria:**
- Each lesson has a title field and attachment upload (video, PDF, PPTX)
- Lessons are ordered sequentially within the course
- Attachments are playable/viewable within the platform

---

### US-4.3: Assign Course to Employees
**As an** Admin,
**I want to** assign a training course to specific employees,
**So that** they are notified and can begin their learning.

**Acceptance Criteria:**
- Admin can select employees from a dropdown/list
- Selected employees receive a notification about the new assignment
- Assigned courses appear in the employee's training view

---

### US-4.4: Progress Through Lessons
**As an** Employee,
**I want to** view lesson content and mark lessons as complete,
**So that** I can progress through my assigned training courses.

**Acceptance Criteria:**
- Lessons display their content/attachment sequentially
- "Next Lesson" button advances to the next lesson and marks the current one complete
- Progress bar updates with each completed lesson

---

### US-4.5: View My Training Progress
**As an** Employee, Supervisor, or Manager,
**I want to** see my own progress across assigned courses,
**So that** I know what I've completed and what remains.

**Acceptance Criteria:**
- "My Progress" section shows each assigned course with completion percentage
- Status badges display: Not Started, In Progress, or Completed
- Lesson count shows completed vs. total lessons

---

### US-4.6: View Employee Training Progress (Admin)
**As an** Admin,
**I want to** see the training progress of all employees for each course,
**So that** I can ensure compliance and identify who needs follow-up.

**Acceptance Criteria:**
- "Assigned Employees Progress" section lists all assigned employees
- Each employee shows progress percentage, completion status, and lesson counts
- Employees are sorted by progress (highest first)

---

### US-4.7: View Employee Training Progress (Manager/Supervisor)
**As a** Manager or Supervisor,
**I want to** see the training progress of employees in my branch,
**So that** I can monitor my team's learning.

**Acceptance Criteria:**
- Progress view is filtered to show only employees from the user's branch
- Same detail level as admin view but scoped to branch

---

### US-4.8: Edit Training Course
**As an** Admin,
**I want to** edit an existing course's details, lessons, and assignees,
**So that** I can update training content as needed.

**Acceptance Criteria:**
- Edit dialog pre-fills with current course data
- Lessons can be added, removed, or reordered
- Assignees can be added or removed
- Changes are saved and reflected immediately

---

### US-4.9: Delete Training Course
**As an** Admin,
**I want to** delete a training course,
**So that** outdated courses are removed from the system.

**Acceptance Criteria:**
- Confirmation dialog appears before deletion
- Course is removed from all views
- Employee progress data for the course is handled appropriately

---

## Epic 5: Team Management

### US-5.1: View Team Directory
**As a** user with team access,
**I want to** see a list of all team members with their name, email, role, branch, and status,
**So that** I can find and reference colleagues.

**Acceptance Criteria:**
- Table displays all team members with relevant columns
- Non-admin users see members filtered to their branch
- Admins see all members across all branches

---

### US-5.2: Add Team Member
**As an** Admin,
**I want to** manually add a new team member with their details,
**So that** I can onboard staff directly without using the invite system.

**Acceptance Criteria:**
- Form captures name, email, role, branch, and status
- New member appears in the team directory immediately
- Duplicate email validation prevents conflicts

---

### US-5.3: Edit Team Member
**As an** Admin,
**I want to** edit an existing team member's role, branch, or status,
**So that** I can update their information as their responsibilities change.

**Acceptance Criteria:**
- Edit dialog pre-fills with current member data
- Changes to role or branch take effect immediately
- Status can be toggled between Active and Inactive

---

### US-5.4: Remove Team Member
**As an** Admin,
**I want to** remove a team member from the platform,
**So that** departed employees no longer appear in the system.

**Acceptance Criteria:**
- Confirmation dialog appears before removal
- Member is permanently removed from the directory
- Their historical data (checklist completions, training progress) is preserved

---

### US-5.5: Toggle Member Status
**As an** Admin,
**I want to** toggle a team member between Active and Inactive status,
**So that** I can temporarily disable access without deleting the account.

**Acceptance Criteria:**
- Status toggle is available on each member row
- Inactive members are visually distinguished (e.g., greyed out)
- Inactive members cannot log in

---

### US-5.6: Generate Invite Code
**As an** Admin,
**I want to** generate a unique invite code with a specific role and branch,
**So that** I can share a registration link with a new hire.

**Acceptance Criteria:**
- Admin selects role and branch before generating
- Unique 6-character code is created
- Shareable link is displayed and copyable

---

### US-5.7: Search and Filter Team
**As a** user,
**I want to** search and filter the team directory,
**So that** I can quickly find specific members.

**Acceptance Criteria:**
- Search field filters by name or email
- Results update as the user types

---

## Epic 6: Branch Management

### US-6.1: View Branch Directory
**As a** user with branch access,
**I want to** see a list of all branches with their name, location, manager, and status,
**So that** I have an overview of all locations.

**Acceptance Criteria:**
- Branch cards display key information at a glance
- Active and inactive branches are visually distinguished
- Clicking a branch navigates to its detail page

---

### US-6.2: Add New Branch
**As an** Admin,
**I want to** add a new branch with name, location, and assigned manager,
**So that** new locations are represented in the system.

**Acceptance Criteria:**
- Form captures branch name, location, manager, and status
- New branch appears in the directory immediately
- Manager dropdown shows available team members

---

### US-6.3: Edit Branch Details
**As an** Admin,
**I want to** edit a branch's name, location, manager, or status,
**So that** branch information stays current.

**Acceptance Criteria:**
- Edit dialog pre-fills with current values
- Changes are saved and reflected immediately

---

### US-6.4: View Branch Details
**As a** Manager or Admin,
**I want to** see detailed information about a specific branch,
**So that** I can monitor its staff, checklists, and performance.

**Acceptance Criteria:**
- Detail page shows branch staff, assigned checklists, and performance metrics
- Staff list shows names, roles, and status
- Checklist summary shows completion rates

---

### US-6.5: Compare Branch Performance
**As an** Admin,
**I want to** compare performance metrics across multiple branches,
**So that** I can identify top-performing and underperforming locations.

**Acceptance Criteria:**
- Branch comparison page shows key metrics side by side
- Visual charts highlight differences between branches
- Sortable by various metrics

---

## Epic 7: Notifications & Inbox

### US-7.1: Receive Task Notifications
**As a** user,
**I want to** receive notifications when I'm assigned a new checklist or training course,
**So that** I'm immediately aware of new responsibilities.

**Acceptance Criteria:**
- Notification is created when a checklist is published with the user as assignee
- Notification is created when a training course is assigned to the user
- Bell icon in the header shows unread notification count

---

### US-7.2: View Notifications in Inbox
**As a** user,
**I want to** view all my notifications in a dedicated Inbox page,
**So that** I can review and manage my alerts.

**Acceptance Criteria:**
- Inbox shows all notifications in reverse chronological order
- Each notification displays sender, title, message, date, and time
- Unread notifications are visually distinguished from read ones

---

### US-7.3: Mark Notifications as Read
**As a** user,
**I want to** mark notifications as read,
**So that** I can track which alerts I've already reviewed.

**Acceptance Criteria:**
- Clicking a notification marks it as read
- Read notifications change visual styling
- Unread count in the header updates accordingly

---

## Epic 8: Internationalization (i18n)

### US-8.1: Switch Language
**As a** user,
**I want to** toggle between English and Arabic,
**So that** I can use the platform in my preferred language.

**Acceptance Criteria:**
- Language toggle button is accessible in the sidebar
- All UI labels, headings, buttons, and messages switch to the selected language
- Language change happens instantly without page reload

---

### US-8.2: RTL Layout Support
**As an** Arabic-speaking user,
**I want** the interface to display in right-to-left (RTL) layout when Arabic is selected,
**So that** the reading experience feels natural.

**Acceptance Criteria:**
- Sidebar moves to the right side of the screen
- Text alignment, margins, and paddings flip appropriately
- Icons and navigation arrows reverse direction
- All components render correctly in RTL mode

---

### US-8.3: Persist Language Preference
**As a** user,
**I want** my language preference to be remembered across sessions,
**So that** I don't have to switch languages every time I log in.

**Acceptance Criteria:**
- Selected language is saved to local storage
- On next visit, the app loads in the previously selected language
- RTL/LTR direction is applied automatically on load

---

### US-8.4: Translated Display Names
**As an** Arabic-speaking user,
**I want to** see team member names, roles, and branch names displayed in Arabic,
**So that** the experience is fully localized.

**Acceptance Criteria:**
- Demo data names are translated using translation dictionaries
- Roles display in Arabic (e.g., "مدير فرع" for Branch Manager)
- Branch names display in Arabic (e.g., "واجهة الرياض" for Riyadh Front)

---

## Epic 9: Reporting & Analytics

### US-9.1: View Daily Performance Report
**As a** Manager or Admin,
**I want to** view daily performance analytics,
**So that** I can assess how operations performed each day.

**Acceptance Criteria:**
- Report page displays daily operational metrics
- Charts visualize task completion rates and trends
- Data is filterable by branch for non-admin users

---

### US-9.2: View Branch Comparison Report
**As an** Admin,
**I want to** compare performance metrics across all branches,
**So that** I can make data-driven decisions about resource allocation.

**Acceptance Criteria:**
- Comparison page shows metrics for all branches side by side
- Visual charts highlight performance differences
- Key metrics include task completion rates and training progress

---

## Epic 10: Navigation & User Experience

### US-10.1: Responsive Sidebar Navigation
**As a** user,
**I want** a collapsible sidebar that adapts to my screen size,
**So that** I can navigate efficiently on both desktop and mobile devices.

**Acceptance Criteria:**
- Sidebar is expanded by default on desktop
- Sidebar collapses to icons on smaller screens
- Hamburger menu toggles sidebar on mobile
- Active page is highlighted in the navigation

---

### US-10.2: Role-Aware Navigation
**As a** user,
**I want to** only see navigation items I have access to,
**So that** the interface is clean and I'm not confused by features I can't use.

**Acceptance Criteria:**
- Sidebar links are filtered based on user role permissions
- Employees see: Dashboard, Checklists, Training
- Managers see: Dashboard, Checklists, Branches, Team, Training, Reports
- Admins see all navigation items

---

### US-10.3: User Profile Display
**As a** logged-in user,
**I want to** see my name and role displayed in the sidebar,
**So that** I know which account I'm using and what access level I have.

**Acceptance Criteria:**
- Sidebar footer shows user's name and role badge
- Role badge uses appropriate label (Super Admin, Branch Manager, Supervisor, Operations)

---

### US-10.4: 404 Not Found Page
**As a** user,
**I want to** see a helpful message when I navigate to a page that doesn't exist,
**So that** I can find my way back to the application.

**Acceptance Criteria:**
- 404 page displays a clear "Page Not Found" message
- A link or button is provided to return to the Dashboard

---

## Summary

| Epic | User Stories | Priority Coverage |
|------|-------------|-------------------|
| Authentication & Onboarding | 4 stories | Must Have |
| Operations Dashboard | 5 stories | Must Have / Should Have |
| Checklist Management | 13 stories | Must Have / Should Have |
| Training Center | 9 stories | Must Have / Should Have |
| Team Management | 7 stories | Must Have |
| Branch Management | 5 stories | Must Have / Should Have |
| Notifications & Inbox | 3 stories | Must Have / Should Have |
| Internationalization | 4 stories | Must Have / Should Have |
| Reporting & Analytics | 2 stories | Should Have |
| Navigation & UX | 4 stories | Must Have |
| **Total** | **56 stories** | |

---

*End of Document*
