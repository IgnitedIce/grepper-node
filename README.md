# Grepper Node.js client

> **Work in progress**

This library is a wrapper for the Grepper API.

## Getting started

### Authentication

Replace `your_api_key` with [your actual API Key](https://www.grepper.com/app/settings-account.php)
```typescript
import Grepper from "./index.ts";

Grepper.apiKey = "your_api_key";
```

### Search All Answers

This endpoint searches all answers based on a query.

```typescript
Grepper.search("strings in c").then((answers) => {
    console.log(answers);
});
```

### Retrieve an Answer

This endpoint retrieves a specific answer.

```typescript
Grepper.retrieve(12345).then((answer) => {
    console.log(answer);
});
```

### Update a specific answer

This endpoint updates a specific answer.

```typescript
Grepper.update(54321, "This answer will be updated").then((updateResult) => {
    console.log(updateResult);
});
```