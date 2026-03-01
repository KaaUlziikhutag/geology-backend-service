# Modular Monolith Boundaries

The application is organized as a modular monolith with domain-oriented boundary modules:

- `auth`: authentication and authorization concerns.
- `hr`: personnel management and HR workflows.
- `pos`: point-of-sale and customer-facing sales operations.
- `laboratory`: mineral/laboratory workflows and result reporting.
- `inventory`: stock and catalog-oriented inventory concerns.

Each boundary module composes existing feature modules to preserve current business logic while making domain ownership explicit.
