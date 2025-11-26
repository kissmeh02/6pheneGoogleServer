# 6phene Website

Informative business website for 6phene, a graphene nanotechnology company based in Guelph, Canada.

## Tech Stack

-   **HTML5**: Semantic structure.
-   **CSS3**: Custom Design System using CSS Variables (No preprocessors required).
-   **Nginx**: Web server configuration.

## Structure

```
webpage/
├── assets/          # Images and static resources
├── css/
│   ├── base.css     # Reset and layout utilities
│   ├── components.css # UI Components (Navbar, Buttons, Cards)
│   └── variables.css # Design System tokens (Colors, Typography)
├── js/              # JavaScript files (if needed)
├── index.html       # Main landing page
└── nginx.conf       # Nginx server block configuration
```

## Design System

The design uses a "Graphene" theme:
-   **Dark Mode by Default**: Reflecting deep tech/material science.
-   **Primary Color**: Cyan/Sky Blue (`#38bdf8`) representing energy and atomic structure.
-   **Typography**: Inter (Clean, modern sans-serif).

## Deployment

1.  **Nginx**:
    Include the provided `nginx.conf` in your main Nginx configuration (`/etc/nginx/sites-enabled/` or `http` block).
    
    ```nginx
    include /path/to/webpage/nginx.conf;
    ```

    Ensure the `root` directive in `nginx.conf` matches the absolute path to this directory.

2.  **Static Files**:
    No build step is required. The files are ready to be served.

