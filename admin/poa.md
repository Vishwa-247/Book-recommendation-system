# Admin Section - PHP Integration Guide (POA)

## Overview
This document describes the server-side variables and endpoints required for the admin section pages.

---

## IT Admin Settings (`/admin/it-admin/`)

### Variables Required
\`\`\`php
$session_data     // (string) Current session array dump
$cache_count      // (int) Total files cached
$disk_max         // (string) Maximum disk space allowed
$disk_available   // (string) Available disk space
$disk_used        // (string) Used disk space
$db_max           // (string) Maximum database space
$db_available     // (string) Available database space
$db_used          // (string) Used database space
$system_variables // (array) List of system variable names
\`\`\`

### Endpoints
\`\`\`
GET  /api/admin/session                -> Returns current session data
POST /api/admin/cache/flush            -> Flushes the cache
GET  /api/admin/system-variables       -> Returns list of system variables
POST /api/admin/system-variables       -> Creates/updates a system variable
     Body: { var_name: string, var_value: string, var_desc: string }
DELETE /api/admin/system-variables/:id -> Deletes a system variable
\`\`\`

---

## Advocate Admin (`/admin/advocates/`)

### Variables Required
\`\`\`php
$advocate_applications  // (array) List of advocate applications
$firm_applications      // (array) List of firm applications
$registered_advocates   // (array) List of registered advocates
$duplicate_advocates    // (array) Possible duplicate profiles
\`\`\`

### Endpoints
\`\`\`
POST /api/admin/advocate/new           -> Creates new advocate application
     Body: { first_name, middle_name, last_name, std_code, phone, email }
GET  /api/admin/advocate/applications  -> Returns all advocate applications
GET  /api/admin/advocate/search        -> Searches advocates
     Query: first_name, surname, city, state, pincode, std_code, phone, email
GET  /api/admin/advocate/check-duplicates -> Checks for duplicate profiles
     Query: first_name, last_name, email
GET  /api/admin/advocate/registered    -> Returns registered advocates
POST /api/admin/firm/new               -> Creates new firm application
     Body: { firm_name }
GET  /api/admin/firm/applications      -> Returns all firm applications
GET  /api/admin/firm/search            -> Searches firms
     Query: firm_name
\`\`\`

---

## Client Admin (`/admin/clients/`)

### Variables Required
\`\`\`php
$live_cases      // (array) List of live client cases
$client_profiles // (array) List of client profiles
\`\`\`

### Endpoints
\`\`\`
GET  /api/admin/client/cases           -> Returns live cases with pagination
     Query: page (int)
GET  /api/admin/client/cases/search    -> Searches cases
     Query: case_id, email
GET  /api/admin/client/cases/flagged   -> Returns flagged cases
     Query: flagged_by (admin|advocate)
POST /api/admin/client/cases/:id/email -> Sends email to client
     Body: { from, to, cc, bcc, subject, message }
POST /api/admin/client/cases/:id/archive -> Archives a case
GET  /api/admin/client/profiles        -> Returns client profiles
GET  /api/admin/client/profiles/search -> Searches client profiles
     Query: first_name, surname, city, state, pincode, std_code, phone, email
\`\`\`

### Sample Case Object
\`\`\`json
{
  "id": "5626048b00b8646d792058493",
  "title": "Case Title",
  "anonymous": false,
  "description": "Case description...",
  "post_date": "2021-03-10 11:55:50",
  "advocates_visited": 6,
  "offers_received": 1,
  "messages_received": 2,
  "advocates": [
    { "name": "Advocate Name", "last_visited": "2021-03-10" }
  ]
}
\`\`\`

---

## Marketing (`/admin/marketing/`)

### Endpoints
\`\`\`
POST /api/admin/marketing/campaign/export -> Exports campaign data
     Body: { campaign_id }
POST /api/admin/marketing/unsubscribed/export -> Exports unsubscribed emails
\`\`\`

---

## Newsletter (`/admin/newsletter/`)

### Variables Required
\`\`\`php
$newsletter_drafts     // (array) List of draft newsletters
$newsletter_categories // (array) List of newsletter categories
$newsletter_sent       // (array) List of sent newsletters
$from_addresses        // (array) Available from email addresses
\`\`\`

### Endpoints
\`\`\`
GET  /api/admin/newsletter/drafts      -> Returns draft newsletters
POST /api/admin/newsletter/drafts      -> Creates/updates draft
     Body: { from, to, subject, content }
POST /api/admin/newsletter/send        -> Sends newsletter
     Body: { draft_id }
DELETE /api/admin/newsletter/drafts/:id -> Deletes draft
GET  /api/admin/newsletter/categories  -> Returns categories
POST /api/admin/newsletter/categories  -> Creates category
     Body: { name, description, web_order, hide_description, active }
DELETE /api/admin/newsletter/categories/:id -> Deletes category
GET  /api/admin/newsletter/sent        -> Returns sent newsletters
\`\`\`

---

## AdEngine (`/admin/adengine/`)

### Variables Required
\`\`\`php
$businesses      // (array) List of businesses
$campaigns       // (array) List of ad campaigns
$targets         // (array) List of ad targets
$target_groups   // (array) List of target groups
\`\`\`

### Endpoints
\`\`\`
GET  /api/admin/adengine/businesses    -> Returns businesses
GET  /api/admin/adengine/campaigns     -> Returns campaigns
     Query: business_id (optional)
POST /api/admin/adengine/campaigns     -> Creates campaign
GET  /api/admin/adengine/targets       -> Returns targets
POST /api/admin/adengine/targets       -> Creates/updates target
GET  /api/admin/adengine/target-groups -> Returns target groups
POST /api/admin/adengine/target-groups -> Creates target group
\`\`\`

---

## Authentication

All admin endpoints require authentication via session cookie or Bearer token.

\`\`\`
Header: Authorization: Bearer <admin_token>
\`\`\`

Or session-based:
\`\`\`
Cookie: PHPSESSID=<session_id>
\`\`\`

---

## Error Responses

All endpoints return errors in this format:
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
\`\`\`

Common error codes:
- `UNAUTHORIZED` - Not logged in or session expired
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `SERVER_ERROR` - Internal server error
