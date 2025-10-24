# Datakoko Website

This repository contains the source code for the Datakoko website, built with Hugo.

## Local Development

To run the site locally, follow these steps:

1.  **Install Hugo:** If you don't have Hugo installed, follow the instructions on the official Hugo website: [https://gohugo.io/getting-started/installing/](https://gohugo.io/getting-started/installing/)

2.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/datakoko-website.git
    cd datakoko-website
    ```

3.  **Run the Hugo development server:**
    ```bash
    hugo server
    ```
    Your site will be available at `http://localhost:1313/`. Any changes you make to the source files will automatically refresh the browser.

## Deployment

This site is deployed to GitHub Pages using a GitHub Actions workflow.

1.  **Push to `main` branch:**
    The deployment workflow is triggered automatically when changes are pushed to the `main` branch.

2.  **Enable GitHub Pages:**
    Ensure that GitHub Pages is enabled for your repository. Go to your repository settings on GitHub, navigate to the "Pages" section, and configure it to deploy from the `gh-pages` branch. The GitHub Action will push the built site to this branch.
