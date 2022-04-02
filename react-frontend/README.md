# File Structure
- `src/apollo/`
    - `apollo.ts`: Basic configuration of the Apollo Client
    - `cache.ts`: Global state of the React app managed through Apollo
    - `apiTypes.ts`: Specifies the type interfaces for all inputs/outputs of GraphQL queries. Gives better IntelliSense when using these queries
    - `hooks.ts`: React hooks that can operate on the global Apollo cache state variable. Allows us to modify our global state
    - `queries.ts`/`mutations.ts`: The specific GraphQL queries

# Running Locally
- Just run `nvm use && npm start`
- For local development you can point the site to a different server by modifying the URI in `src/apollo/apollo.ts`

# Deploying
- Just run `npm run deploy` to bundle the code for Github Pages
