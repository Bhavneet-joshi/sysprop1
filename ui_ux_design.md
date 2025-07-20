# UI/UX Design Specification

This document outlines the UI/UX design for the web portal, as per the Statement of Work.

## 1. General Design Principles

*   **Font:** Lato
*   **Color Palette:**
    *   Navy Blue: `#000080`
    *   Goldenrod: `#CFA511`, `#DAA520`
    *   Dark Blue: `#0000AE`
    *   Golden: `#FFD700`
    *   Black: `#000000`
    *   Shades of Grey
    *   White: `#FFFFFF`
*   **Theme:** A uniform, professional, corporate theme will be applied across the application.
*   **Modes:** Both Light and Dark modes will be supported, with user preference saved in local storage.
*   **Responsiveness:** All pages will be fully responsive for mobile, tablet, and desktop screens.
*   **Accessibility:** The portal will comply with WCAG 2.1 Level AA standards.

## 2. Core Components

### 2.1. Navigation Bar

*   **Position:** Fixed at the top of the page (except on the "About Us" page).
*   **Content:**
    *   Company Logo (SVG) in the top-left corner.
    *   Menu items: Home, About Us, Services, Contact Us.
    *   Hover effect on menu items (similar to incometax.gov.in).
    *   Buttons: "Login" and "Register".

### 2.2. Footer

*   **Content:**
    *   "All rights reserved" message.
    *   Social media links.
    *   Links to policy pages.
    *   Copyright notice (similar to ril.com).

## 3. Public Pages

### 3.1. Home Page

*   **Layout:** Clean, professional corporate design.
*   **Content:**
    *   Prominently displayed tagline: "At HLSG Industries, we don’t just envision the future—we build it."

### 3.2. About Us Page

*   **Sub-pages:**
    *   **About Founders:** Details about the company founders.
    *   **About Company:** Features a 3D animation of the company logo, with explanations for each element.

### 3.3. Services Page

*   **Layout:** Central hub for all services.
*   **Content:**
    *   Brief information about each service.
    *   Links to service-specific pages.

### 3.4. Service Specific Page

*   **Content:**
    *   Detailed information about the service.
    *   A button to "Get Service," which redirects to the "Contact Us" page.

### 3.5. Contact Us Page

*   **Content:**
    *   Company contact details.
    *   Embedded Google Map showing the office location.

### 3.6. Policy Page

*   **Content:**
    *   Privacy Policy and Data Protection Policy.
    *   Link to download policies in PDF format.

### 3.7. Login Page

*   **Design:** Similar to the Income Tax portal login.
*   **Functionality:**
    *   Fields for email and password.
    *   CAPTCHA.
    *   "Forgot Password" link.

### 3.8. Register Page

*   **Design:** Multi-step form, similar to the Income Tax portal registration.
*   **Functionality:**
    *   Step 1: Mobile number, email address, CAPTCHA.
    *   Step 2: OTP verification.
    *   Step 3: User details (name, contact info, etc.).
    *   Step 4: Password creation with strength requirements.

## 4. Protected Pages

### 4.1. Client Pages

*   **Profile Page:** Displays client details, with an option to change the password.
*   **Dashboard:**
    *   Counter for the number of agreements.
    *   List of the 5 most recent agreements.
    *   Link to the full "List of Contracts" page.
    *   "Request New Contract" button.
*   **List of Contracts Page:** Tabular view of all contracts, with filtering and sorting options.
*   **Contract View Page:**
    *   Displays the contract PDF.
    *   Allows clients to add, edit, and delete comments on the PDF.

### 4.2. Employee Pages

*   **Profile Page:** Displays employee details, with an option to request a password change.
*   **Dashboard:**
    *   Counter for assigned agreements.
    *   List of the 5 most recent assigned agreements.
    *   Link to the full "List of Contracts" page.
*   **List of Contracts Page:** Tabular view of assigned contracts, with filtering options.
*   **Contract Specific Page:**
    *   Displays all contract details.
    *   Action buttons (Edit, Reply to Comments, etc.) based on permissions.

### 4.3. Admin Pages

*   **Profile Page:** Displays admin details, with an option to change the password.
*   **Dashboard:**
    *   Counters for total contracts, categorized by client, employee, and status.
    *   Lists of the 5 most recent contracts by date, value, and duration.
*   **List of Contracts Page:**
    *   Tabular view of all company contracts.
    *   Filtering options.
    *   "New Contract" button.
*   **New Contract Page:** Form to add new contracts and link files from Microsoft 365.
*   **User Management Page:**
    *   Manage employee passwords and details.
    *   Table to manage access permissions (Preparers, Reviewers) with multi-level review support.