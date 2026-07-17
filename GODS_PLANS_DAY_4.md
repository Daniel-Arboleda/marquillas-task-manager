# ============================================================

# Marquillas Task Manager

# Document: GODS_PLAN_DAY_04.md

# Title: Technical Assessment Backend

# Version: 1.0

# Status: Draft | In Progress | Approved | Completed

# Author: Development Team

# Created: 2026-07-17

# Last Update: 2026-07-17

# ============================================================

# GOD'S PLAN — DAY 04

# Technical Assessment Backend

## Marquillas Task Manager API

---

# Objective

Complete the technical assessment backend implementing a production-ready architecture based on FastAPI, SQLAlchemy, SQL Server, JWT Authentication and Role Based Access Control (RBAC), validating all functional requirements and correcting the final authorization inconsistency detected during the audit.

---

# Technologies

- Python
- FastAPI
- SQLAlchemy
- SQL Server
- Docker Compose
- JWT Authentication
- Swagger / OpenAPI
- RBAC
- Repository Pattern
- Service Layer
- Query / Command Separation

---

# Final Architecture

```
Controller
        │
        ▼
TaskService
        │
        ├──────────────┐
        ▼              ▼
QueryService     CommandService
        │              │
        └──────┬───────┘
               ▼
ValidationService
               │
               ▼
Repository
               │
               ▼
Database
```

---

# Refactoring Completed

TaskService divided into:

- TaskQueryService
- TaskCommandService
- TaskValidationService

Responsibilities:

TaskQueryService

- Read operations
- Pagination
- Filtering
- Query execution

TaskCommandService

- Create
- Update
- Delete
- History registration
- Transaction management

TaskValidationService

- Due date validation
- User validation
- Assignment validation
- Reassignment validation
- RBAC validation
- Pagination validation

---

# Implemented Features

## Authentication

- JWT Login
- Current authenticated user
- Password validation
- Active user validation

Endpoints

POST /api/auth/login

GET /api/auth/me

Status

COMPLETED

---

## Users

Implemented

- Create user
- Role validation
- Active validation

RBAC

Administrator

- Full access

Member

- Forbidden

Status

COMPLETED

---

## Tasks

Implemented

Create Task

Read Task

Update Task

Delete Task

Pagination

Filtering

Soft Delete

History

Status

COMPLETED

---

# RBAC

Administrator

Can

- List all tasks
- View any task
- Update any task
- Delete any task
- Assign tasks
- Reassign tasks
- Create users

Member

Can

- View own tasks
- View assigned tasks
- Update own tasks
- Delete own tasks

Cannot

- View tasks from other users
- Update tasks from other users
- Delete tasks from other users
- Create users
- Reassign tasks

Status

COMPLETED

---

# Critical Issue Detected During Audit

Original behavior

Member

GET /api/tasks/{id}

returned

200 OK

for tasks belonging to another user.

This generated an authorization inconsistency because:

GET

did not validate access while

PATCH

DELETE

already validated RBAC correctly.

---

# Root Cause

TaskService.get()

returned directly:

TaskQueryService.get()

without invoking:

TaskValidationService.validate_task_access()

Therefore, GET by ID bypassed authorization.

---

# Solution Implemented

TaskService.get()

was updated to receive:

- current_user_id
- is_admin

After retrieving the task, the service now executes:

validate_task_access()

before returning the resource.

Task endpoint updated to forward:

- current_user.id
- current_user.role == "admin"

Result

GET

PATCH

DELETE

now share the exact same RBAC policy.

---

# Functional Validation

## Health

GET /health

Result

200 OK

---

## Database

GET /health/database

Result

200 OK

---

## Login

Admin

Result

200 OK

Member

Result

200 OK

---

## Current User

GET /api/auth/me

Administrator

Result

200 OK

Member

Result

200 OK

---

## Users

Administrator

Create user

201 Created

Member

Create user

403 Forbidden

---

## Tasks

Administrator

List

200 OK

View

200 OK

Update

200 OK

Delete

204 No Content

Member

List

200 OK

Only authorized tasks returned

View task from another user

403 Forbidden

View own task

Allowed according to ownership

Update task from another user

403 Forbidden

Delete task from another user

403 Forbidden

---

# Authorization Validation

Verified

GET

PATCH

DELETE

produce

403 Forbidden

when the authenticated user does not own the task and is not Administrator.

RBAC validation is now consistent.

---

# Soft Delete

Delete operation performs logical deletion.

Task status changes to:

cancelled

History entry is created.

Database record remains available.

Status

COMPLETED

---

# Task History

History is automatically generated for

created

updated

deleted

Status

COMPLETED

---

# Pagination

Validated

page

page_size

Validation

page >= 1

page_size between 1 and 100

Status

COMPLETED

---

# Filtering

Validated

status

priority

assigned_user_id

Status

COMPLETED

---

# Security

Implemented

JWT

RBAC

Repository isolation

Validation layer

Permission validation

Role validation

Assignment validation

Reassignment validation

Current user validation

Status

COMPLETED

---

# Docker Validation

Validated

Docker Compose

Backend

SQL Server

Network

Health Checks

Status

COMPLETED

---

# Swagger Validation

Validated

Authentication

Users

Tasks

Health

Database

Authorization

Status

COMPLETED

---

# Final Audit

Architecture

PASS

Repository Pattern

PASS

Command Query Separation

PASS

Validation Layer

PASS

RBAC

PASS

JWT

PASS

CRUD

PASS

Pagination

PASS

Filtering

PASS

Soft Delete

PASS

History

PASS

Docker

PASS

SQL Server

PASS

Swagger

PASS

Authorization

PASS

---

# Final Result

Status

APPROVED

Architecture

10/10

Security

10/10

Code Quality

10/10

RBAC

10/10

Endpoint Consistency

10/10

Production Readiness

10/10

---

# Version

v0.2.0

Technical Assessment Backend

Completed Successfully

---

# Next Step

Create final commit.

Create version tag.

Push branch.

Push tag.

Open Pull Request.

Merge into main branch after review.
