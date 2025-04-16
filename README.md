# ImbalancedLearningRegressionDemoUI

## Description

This is the user interface for the [ImbalancedLearningRegression](https://github.com/paobranco/ImbalancedLearningRegression) project for demonstration purposes. The UI is accessible at [imbalanced-learning-regression.com](https://www.imbalanced-learning-regression.com).

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`Next.js`](https://nextjs.org), [`Material-UI`](https://mui.com) and [`Recharts`](https://recharts.org).

The project works together with the [ImbalancedLearningRegressionDemo](https://github.com/wuwenglei/ImbalancedLearningRegressionDemo) project using AWS. Alternatively, you may implement your own backend solution, and provide your own backend API endpoints by setting the environment variable "API_BASE_URL".

## Deployment

This project is deployed on [AWS](https://aws.amazon.com) using [AWS Amplify](https://aws.amazon.com/amplify). A simple dockerfile is provided for your convenience in case you want to deploy the UI on your own infrastructure.
