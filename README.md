# [WAPES BAL System v3](https://bal.wapesleague.com/)

> An application to create your legend for the [WAPES League community](https://www.wapesleague.com/).

## Requirements

- A [Google Service Account](https://cloud.google.com/iam/docs/service-accounts) with granted permissions to read the [WAPES Google Sheet](https://docs.google.com/spreadsheets/d/1c89tdesdBy3P6qpY-5jmuiAIUX_sB44B4GyhpXFKYD8)
- [Node.js](https://nodejs.org/en/) 12 or higher
- [Git](https://git-scm.com/)
- [Yarn v1](https://classic.yarnpkg.com/lang/en/)

## Installing

- Clone the repository and install the dependencies:

  ```bash
  git clone https://github.com/freddy38510/wapes-bal-system && cd wapes-bal-system

  yarn
  ```

- Fill `.env.sample` file with your [Google service account keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) and rename it to `.env`.

## Developing

- Fetch and store the data from the WAPES Google Sheet to json files:

  ```bash
  yarn build:data
  ```

- Build the application and start a local webserver which replicate the Vercel deployment environment:

  ```bash
  yarn start
  ```

- Open http://localhost:3000 and take benefit from live reloading during development.
