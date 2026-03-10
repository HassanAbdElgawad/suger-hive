# SugarHive - Business Requirements Document (BRD)

**Document Version:** 1.0
**Date:** February 25, 2026
**Project Name:** SugarHive - Operational Management System
**Prepared For:** SugarHive Management Team

---

## 1. Executive Summary

SugarHive is a centralized operational management platform purpose-built for multi-branch food and beverage businesses (coffee shops, restaurants, and similar chains). The system digitizes and standardizes daily operations by providing tools for interactive checklists, employee training, team coordination, branch oversight, and performance reporting -- all within a single, bilingual (English/Arabic) web application.

The platform replaces manual paper-based checklists, fragmented communication channels, and inconsistent training delivery with a unified digital workspace. It supports a role-based hierarchy (Super Admin, Branch Manager, Supervisor, Operations Staff) that mirrors the real organizational structure of multi-branch F&B businesses, ensuring the right people see the right information at the right time.

SugarHive is designed for rapid deployment and ease of use, with a modern responsive interface that works across desktop and mobile devices, full right-to-left (RTL) language support for Arabic-speaking teams, and persistent data storage that keeps operations running smoothly across sessions.

---

## 2. Problem Statement

Multi-branch food and beverage businesses face several operational challenges:

1. **Inconsistent Task Execution**: Daily opening, closing, and cleaning checklists are managed on paper or through ad-hoc methods, leading to missed tasks, no audit trails, and inconsistent quality across branches.

2. **Fragmented Training**: Onboarding and ongoing training materials are scattered across WhatsApp groups, shared drives, and in-person sessions, making it difficult to track who has completed what training and to ensure compliance.

3. **Limited Visibility**: Regional managers and headquarters have little real-time visibility into what is happening at individual branches, relying on phone calls and delayed reports to monitor operations.

4. **Communication Gaps**: Important operational updates, policy changes, and task assignments are communicated through informal channels that lack accountability and tracking.

5. **Language Barriers**: Teams operating in the Middle East require bilingual support (English and Arabic) with proper RTL layout, which most off-the-shelf tools do not adequately provide.

6. **No Centralized Team Management**: Employee records, roles, branch assignments, and access permissions are managed in spreadsheets or separate HR systems that are disconnected from daily operations.

---

## 3. Objectives

| # | Objective | Measurable Outcome |
|---|-----------|-------------------|
| O1 | Digitize daily operational checklists with evidence capture | 100% of daily checklists completed digitally with photo/comment evidence |
| O2 | Standardize employee training and track completion | All employees complete assigned training courses with progress tracked to the lesson level |
| O3 | Provide real-time operational visibility across all branches | Headquarters can view live checklist status, overdue tasks, and branch performance at any time |
| O4 | Enforce role-based access to ensure data security and relevance | Each user role sees only the features and data appropriate to their responsibilities |
| O5 | Support bilingual operations (English/Arabic) with RTL | Full UI translation with seamless language switching, no page reload required |
| O6 | Centralize team management with invite-based onboarding | All team members onboarded through a controlled invite system with pre-assigned roles and branches |
| O7 | Enable historical audit trails for compliance | Every checklist completion is logged with timestamp, user, evidence, and status for future review |

---

## 4. Scope

### 4.1 In Scope

| Area | Features Included |
|------|------------------|
| **Authentication** | Email/password login, invite-code-based registration, session persistence, logout |
| **Role-Based Access Control** | Four user roles (Admin, Manager, Supervisor, Employee) with granular feature-level permissions |
| **Operations Dashboard** | Summary statistics (completed, pending, overdue tasks), live operations feed, operational logs, quick-access navigation |
| **Checklist Management** | Create/edit/delete checklist templates, assign to branches and employees, set frequency (daily/weekly/monthly), time windows, draft-publish workflow |
| **Checklist Execution** | Complete/partial/incomplete item status, photo evidence upload, comment entry, progress tracking, auto-overdue detection |
| **Checklist History** | Timestamped completion records with user attribution, evidence review, exportable logs |
| **Training Center** | Course creation with multi-lesson structure, multimedia attachments (video/PDF/PPTX), category organization |
| **Training Tracking** | Per-employee lesson-level progress, completion status badges, assigned course management |
| **Team Management** | Employee directory, add/edit/remove members, status toggling (Active/Inactive), role and branch assignment |
| **Invite System** | Admin-generated unique invite codes with pre-assigned role and branch, shareable registration links |
| **Branch Management** | Branch directory, manager assignment, staff counts, status management, branch-level performance views |
| **Branch Comparison** | Comparative analytics across multiple branches |
| **Daily Performance Reports** | Operational analytics and daily reporting dashboard |
| **Notifications / Inbox** | System-generated alerts for task assignments, overdue items, training assignments, internal messaging |
| **Organization Settings** | General organization configuration, security settings |
| **Internationalization** | Full English/Arabic translation, RTL layout support, language toggle, translated names/roles/branches |
| **Responsive Design** | Collapsible sidebar, mobile-friendly layout, touch-optimized interactions |

### 4.2 Out of Scope

| Area | Reason |
|------|--------|
| Native mobile applications (iOS/Android) | Web application is responsive and mobile-optimized; native apps are a future phase |
| Payment processing or POS integration | SugarHive focuses on operations, not transactions |
| Inventory or supply chain management | Separate domain requiring dedicated tooling |
| Customer-facing features (ordering, loyalty) | Platform is internal-operations-only |
| Advanced HR functions (payroll, leave, contracts) | Team management is limited to operational roles and branch assignment |
| Third-party calendar or email integrations | Notifications are handled within the platform |
| Offline mode / PWA | Requires internet connection for current version |
| Multi-tenant (multi-organization) support | Single-organization deployment for current version |

---

## 5. Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| **Business Owner / CEO** | Executive Sponsor | Overall operational efficiency, brand consistency across branches, ROI |
| **Operations Director** | Primary User / Decision Maker | Real-time visibility into all branch operations, compliance enforcement, training oversight |
| **Regional / Area Manager** | Key User | Multi-branch oversight, performance comparison, team management |
| **Branch Manager** | Daily User | Branch-level task management, team supervision, local training delivery |
| **Supervisor** | Daily User | Shift-level checklist execution, team monitoring, task escalation |
| **Operations Staff (Employee)** | End User | Completing assigned checklists, progressing through training, receiving task notifications |
| **IT / Technical Team** | Support | Deployment, maintenance, data management, system configuration |
| **Quality Assurance / Compliance** | Reviewer | Audit trail review, evidence verification, standards compliance |

---

## 6. User Personas

### Persona 1: Ahmad - Super Admin (Operations Director)
- **Age**: 42
- **Tech Comfort**: Moderate
- **Goals**: Oversee all branches from a single dashboard, ensure consistent quality standards, track training compliance across the organization
- **Frustrations**: Currently relies on branch managers calling in updates; no way to verify if checklists were actually completed; training completion is self-reported
- **Uses SugarHive for**: Dashboard overview, creating checklist templates, building training courses, managing the team directory, generating invite codes, viewing reports and branch comparisons

### Persona 2: Sara - Branch Manager
- **Age**: 34
- **Tech Comfort**: High
- **Goals**: Keep her branch running smoothly, ensure staff complete daily tasks on time, onboard new team members quickly
- **Frustrations**: Paper checklists get lost; new employees ask the same questions repeatedly; hard to prove compliance during audits
- **Uses SugarHive for**: Monitoring her branch's checklist progress, reviewing completed tasks with photo evidence, tracking her team's training progress, viewing branch-specific reports

### Persona 3: Omar - Supervisor
- **Age**: 28
- **Tech Comfort**: High
- **Goals**: Make sure the shift runs well, complete all assigned checklists before deadlines, help team members with their tasks
- **Frustrations**: Not always clear which checklists are his responsibility; forgets tasks during busy shifts; no easy way to document issues
- **Uses SugarHive for**: Viewing and completing assigned checklists, uploading photos of completed tasks, adding comments on issues found, completing assigned training modules

### Persona 4: Fatima - Operations Staff (Employee)
- **Age**: 22
- **Tech Comfort**: Moderate
- **Goals**: Know exactly what tasks she needs to do each shift, complete her training to advance, stay informed about operational changes
- **Frustrations**: Instructions are verbal and inconsistent; training is informal and untracked; doesn't know if she's meeting expectations
- **Uses SugarHive for**: Completing assigned checklists, progressing through training courses with video/PDF lessons, receiving notifications about new assignments

---

## 7. Functional Requirements

### 7.1 Authentication & Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | The system shall allow users to log in using email and password | Must Have |
| FR-AUTH-02 | The system shall support user registration only via a valid 6-character alphanumeric invite code | Must Have |
| FR-AUTH-03 | The system shall persist user sessions across browser sessions using local storage | Must Have |
| FR-AUTH-04 | The system shall provide a logout function that clears the user session | Must Have |
| FR-AUTH-05 | The system shall initialize default demo accounts on first load for evaluation purposes | Should Have |

### 7.2 Role-Based Access Control

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RBAC-01 | The system shall support four roles: Admin, Manager, Supervisor, Employee | Must Have |
| FR-RBAC-02 | The system shall restrict navigation menu items based on user role permissions | Must Have |
| FR-RBAC-03 | The system shall enforce feature-level access (Dashboard, Checklists, Branches, Team, Training, Settings, Reports) per role | Must Have |
| FR-RBAC-04 | The system shall filter data by branch for non-admin users so they only see their branch's data | Must Have |
| FR-RBAC-05 | Protected routes shall redirect unauthorized users away from restricted pages | Must Have |

### 7.3 Operations Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | The dashboard shall display summary statistics: completed tasks, pending tasks, active users, overdue tasks | Must Have |
| FR-DASH-02 | The dashboard shall show a live operations feed with real-time checklist activity | Must Have |
| FR-DASH-03 | The dashboard shall display operational logs with export-to-CSV capability | Should Have |
| FR-DASH-04 | The dashboard shall provide quick-access cards for training progress | Should Have |
| FR-DASH-05 | The dashboard shall show a personalized welcome message with the user's name | Nice to Have |

### 7.4 Checklist Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CL-01 | Admins shall be able to create checklist templates with title, frequency (Daily/Weekly/Monthly), branch, assignee, and time window | Must Have |
| FR-CL-02 | Checklists shall support a draft-publish workflow where drafts are not visible to non-admin users | Must Have |
| FR-CL-03 | The system shall display checklists in filterable tabs: All, Active, Completed, Overdue, Drafts | Must Have |
| FR-CL-04 | Each checklist item shall support three completion states: Complete, Partial, Incomplete | Must Have |
| FR-CL-05 | Users shall be able to attach a photo to any checklist item as evidence | Must Have |
| FR-CL-06 | Users shall be able to add a text comment to any checklist item | Must Have |
| FR-CL-07 | The system shall automatically calculate and display checklist completion percentage | Must Have |
| FR-CL-08 | The system shall automatically mark checklists as "Overdue" when the end time has passed without completion | Must Have |
| FR-CL-09 | The system shall maintain a completion history log for each checklist with timestamps, user attribution, and evidence | Must Have |
| FR-CL-10 | Admins shall be able to edit, duplicate, and delete checklist templates | Should Have |
| FR-CL-11 | The system shall support "Complete All" and "Reset All" bulk actions on checklist items | Should Have |
| FR-CL-12 | Admins shall be able to unpublish a published checklist, reverting it to draft status | Should Have |
| FR-CL-13 | The system shall support adding new tasks to an existing checklist with tag categorization | Should Have |

### 7.5 Training Center

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TR-01 | Admins shall be able to create training courses with title, description, category, instructor, duration, and cover image | Must Have |
| FR-TR-02 | Each course shall contain multiple lessons, each with a title and optional multimedia attachment (video, PDF, PPTX) | Must Have |
| FR-TR-03 | Courses shall be assignable to specific employees | Must Have |
| FR-TR-04 | The system shall track per-employee, per-lesson progress through each course | Must Have |
| FR-TR-05 | The system shall display progress as percentage with status badges: Not Started, In Progress, Completed | Must Have |
| FR-TR-06 | Employees shall be able to navigate through lessons sequentially and mark them complete | Must Have |
| FR-TR-07 | Admins shall see an aggregated view of all employee progress for each course | Must Have |
| FR-TR-08 | Non-admin users shall see only their own progress (or their branch's progress for Managers/Supervisors) | Must Have |
| FR-TR-09 | Admins shall be able to edit and delete courses | Should Have |
| FR-TR-10 | The system shall generate notifications when new courses are assigned to employees | Should Have |

### 7.6 Team Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TM-01 | Admins shall be able to view a directory of all team members with name, email, role, branch, and status | Must Have |
| FR-TM-02 | Admins shall be able to add, edit, and remove team members | Must Have |
| FR-TM-03 | Admins shall be able to toggle team member status between Active and Inactive | Must Have |
| FR-TM-04 | Admins shall be able to generate unique invite codes with a pre-assigned role and branch | Must Have |
| FR-TM-05 | The invite system shall produce a shareable registration URL containing the invite code | Must Have |
| FR-TM-06 | Each invite code shall be single-use and marked as used after registration | Must Have |
| FR-TM-07 | The team directory shall be filterable and searchable | Should Have |

### 7.7 Branch Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BR-01 | The system shall display a directory of all branches with name, location, manager, and status | Must Have |
| FR-BR-02 | Admins shall be able to add, edit, and remove branches | Must Have |
| FR-BR-03 | Each branch shall have a detail view showing assigned staff, checklists, and performance metrics | Must Have |
| FR-BR-04 | The system shall support branch comparison analytics across multiple locations | Should Have |
| FR-BR-05 | Admins shall be able to assign a manager to each branch | Should Have |

### 7.8 Notifications & Inbox

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NF-01 | The system shall generate notifications for checklist assignments and training assignments | Must Have |
| FR-NF-02 | Notifications shall be delivered to specific users based on assignment | Must Have |
| FR-NF-03 | Users shall be able to view and manage their notifications in the Inbox | Must Have |
| FR-NF-04 | Notifications shall display as read/unread with visual distinction | Should Have |
| FR-NF-05 | Notification content shall respect the user's current language setting | Should Have |

### 7.9 Internationalization (i18n)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-I18N-01 | The system shall support English and Arabic languages for all UI text | Must Have |
| FR-I18N-02 | Users shall be able to switch languages via a toggle without page reload | Must Have |
| FR-I18N-03 | The system shall apply RTL (right-to-left) layout when Arabic is selected | Must Have |
| FR-I18N-04 | Demo data names, roles, and branch names shall be translated when Arabic is active | Should Have |
| FR-I18N-05 | Language preference shall persist across sessions | Must Have |

### 7.10 Reporting

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RP-01 | The system shall provide a Daily Performance report page with operational analytics | Should Have |
| FR-RP-02 | The system shall provide a Branch Comparison page for cross-location analysis | Should Have |
| FR-RP-03 | Operational logs shall be exportable as CSV files | Should Have |

---

## 8. Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-01 | **Performance** | Pages shall load within 2 seconds on a standard broadband connection | < 2s initial load |
| NFR-02 | **Performance** | UI interactions (tab switches, dialog opens) shall respond within 200ms | < 200ms response |
| NFR-03 | **Usability** | The interface shall be usable on screens from 375px (mobile) to 2560px (desktop) | Fully responsive |
| NFR-04 | **Usability** | All interactive elements shall have appropriate `data-testid` attributes for automated testing | 100% coverage |
| NFR-05 | **Accessibility** | The UI shall use semantic HTML and ARIA-compliant components (Radix UI primitives) | WCAG 2.1 AA target |
| NFR-06 | **Reliability** | Data stored in localStorage shall persist across browser sessions and page reloads | Zero data loss on reload |
| NFR-07 | **Scalability** | The system shall support up to 50 team members and 20 branches without performance degradation | 50 users, 20 branches |
| NFR-08 | **Security** | User passwords shall be stored and compared on the client side (current version); future versions shall implement server-side hashing | Planned improvement |
| NFR-09 | **Maintainability** | The codebase shall use TypeScript with strict type checking for all shared data models | 100% typed schemas |
| NFR-10 | **Compatibility** | The application shall function correctly on the latest versions of Chrome, Firefox, Safari, and Edge | Latest 2 versions |
| NFR-11 | **Availability** | When deployed, the application shall maintain 99% uptime | 99% uptime SLA |
| NFR-12 | **Localization** | RTL layout shall not break any UI components or interactions | Zero RTL layout bugs |

---

## 9. Assumptions

| # | Assumption |
|---|-----------|
| A1 | All users have access to a modern web browser (Chrome, Firefox, Safari, or Edge) and a stable internet connection. |
| A2 | The organization has a clear hierarchical structure (Admin > Manager > Supervisor > Employee) that maps to the four platform roles. |
| A3 | Each employee belongs to a single branch at any given time. Admins operate across all branches. |
| A4 | Photo evidence captured during checklist completion is acceptable as base64-encoded images stored in browser localStorage. |
| A5 | The initial deployment will serve a single organization. Multi-tenancy is not required at launch. |
| A6 | The default demo data (sample users, branches, checklists, courses) is sufficient for evaluation and testing purposes. |
| A7 | Arabic translations provided in the application are reviewed and approved by a native Arabic speaker within the organization. |
| A8 | The invite-based registration model is acceptable for controlling user onboarding (no self-registration). |
| A9 | Concurrent usage will not exceed 50 simultaneous users in the initial deployment. |

---

## 10. Constraints

| # | Constraint | Impact |
|---|-----------|--------|
| C1 | **Browser Storage Dependency**: Primary data persistence relies on localStorage, which is limited to ~5-10MB per origin and is browser-specific. | Users cannot access their data from a different browser or device; data loss risk if browser storage is cleared. |
| C2 | **No Offline Support**: The application requires an active internet connection to load and function. | Users in areas with poor connectivity may experience disruptions. |
| C3 | **Single Language at a Time**: The UI displays in one language at a time (English or Arabic), not both simultaneously. | Bilingual teams must toggle between languages. |
| C4 | **Client-Side Authentication**: Current authentication is handled entirely on the frontend without server-side session validation. | Not suitable for high-security environments without backend auth implementation. |
| C5 | **Photo Storage Limitation**: Checklist photos are stored as base64 strings in localStorage, consuming significant storage space. | Heavy photo usage may approach localStorage limits. |
| C6 | **Replit Hosting Environment**: The application is deployed on Replit's infrastructure with its specific capabilities and limitations. | Deployment and scaling options are governed by the Replit platform. |

---

## 11. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | **Data Loss from localStorage Clearing** | Medium | High | Implement server-side database persistence (PostgreSQL via Drizzle ORM is already configured); regular data export reminders. |
| R2 | **localStorage Size Limits Exceeded** | Medium | Medium | Implement image compression before storage; migrate photo storage to server-side file storage or cloud storage. |
| R3 | **Unauthorized Access Due to Client-Side Auth** | Low | High | Migrate authentication logic to server-side with proper password hashing and session tokens. |
| R4 | **Arabic Translation Inaccuracies** | Medium | Low | Engage native Arabic speakers for translation review; implement a translation feedback mechanism. |
| R5 | **Browser Compatibility Issues** | Low | Medium | Maintain automated UI testing across target browsers; use well-supported libraries (Radix UI, Tailwind CSS). |
| R6 | **User Adoption Resistance** | Medium | High | Provide training sessions; ensure intuitive UX; gather and act on early feedback; support the language staff are comfortable with. |
| R7 | **Concurrent Edit Conflicts** | Low | Medium | Current localStorage model does not support real-time multi-user collaboration; mitigated by branch-level data segregation and future server-side persistence. |

---

## 12. Success Metrics

| # | Metric | Target | Measurement Method |
|---|--------|--------|--------------------|
| KPI-1 | **Checklist Digital Adoption Rate** | 90% of daily checklists completed digitally within 30 days of launch | Count of digitally completed checklists vs. expected checklists |
| KPI-2 | **Average Checklist Completion Time** | Reduce from baseline by 20% within 60 days | Timestamp analysis of checklist start-to-completion |
| KPI-3 | **Training Course Completion Rate** | 80% of assigned courses completed within their target timeframe | Training progress tracking data |
| KPI-4 | **Overdue Task Reduction** | Reduce overdue checklists by 50% within 60 days of launch | Overdue status count trend analysis |
| KPI-5 | **User Engagement** | 85% of registered users log in at least once per working day | Login frequency tracking |
| KPI-6 | **Evidence Compliance** | 70% of checklist items include photo evidence where required | Photo attachment rate per checklist |
| KPI-7 | **Branch Performance Consistency** | Reduce performance variance between branches by 30% | Branch comparison report score deviation |
| KPI-8 | **User Satisfaction** | Net Promoter Score (NPS) of 40+ among staff | Quarterly internal survey |
| KPI-9 | **System Uptime** | 99% availability during operating hours | Deployment monitoring |

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **Branch** | A physical location (coffee shop, restaurant outlet) operated by the organization. Each branch has a manager, staff, and its own set of operational checklists. |
| **Checklist** | A structured list of tasks that must be completed during a specific time period (daily, weekly, or monthly). Checklists are created as templates and assigned to branches. |
| **Checklist Item** | An individual task within a checklist that can be marked as Complete, Partial, or Incomplete, with optional photo and comment evidence. |
| **Course** | A training module consisting of multiple lessons, created by admins and assigned to employees for skill development and compliance. |
| **Lesson** | A single unit of learning within a course, which may include text content and multimedia attachments (video, PDF, PPTX). |
| **Draft** | A checklist that has been created but not yet published. Drafts are only visible to admins and can be edited before publishing. |
| **Invite Code** | A unique 6-character alphanumeric code generated by an admin to allow a new user to register on the platform with a pre-assigned role and branch. |
| **RTL (Right-to-Left)** | A text direction layout used for Arabic and other right-to-left languages, where content flows from right to left. |
| **i18n (Internationalization)** | The design practice of making the application adaptable to different languages and regions without engineering changes. |
| **Role** | A permission level assigned to a user that determines which features and data they can access. SugarHive has four roles: Admin, Manager, Supervisor, and Employee (Operations). |
| **Super Admin** | The highest-level role with full access to all features, all branches, and all administrative functions including settings, team management, and reporting. |
| **Branch Manager** | A role responsible for overseeing a specific branch's operations, team, checklists, and training. |
| **Supervisor** | A role responsible for executing and monitoring checklists and training within their assigned branch. |
| **Operations (Employee)** | The frontline staff role that completes assigned checklists and training courses. |
| **Overdue** | A status automatically applied to a checklist when its designated end time has passed without full completion. |
| **Evidence** | Photos and/or comments attached to checklist items to document completion or issues found during task execution. |
| **localStorage** | A web browser storage mechanism that persists key-value data across browser sessions. Used by SugarHive for client-side data persistence. |
| **Drizzle ORM** | A TypeScript-first Object-Relational Mapper used for defining database schemas and executing type-safe queries against PostgreSQL. |

---

*End of Document*
