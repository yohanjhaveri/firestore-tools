# Firestore Tools

A convenient tool to securely perform read or write operations on large volumes of data in firestore with various configuration options from your local machine

- [Setup](#setup)
- [Usage](#usage)
  * [How to configure the `config` object](#how-to-configure-the--config--object)
    + [Type](#type)
    + [Attributes](#attributes)
    + [Example `pull` config](#example--pull--config)
    + [Example `push` config](#example--push--config)
  * [How to format your data file for a `"push"` operation](#how-to-format-your-data-file-for-a---push---operation)
  * [Example Data File Contents](#example-data-file-contents)

## Setup

1. Clone the repository to your local machine
```
git clone https://github.com/yohanjhaveri/firestore-tools
```

2. Enter the repository directory
```
cd firestore-tools
```

3. Install dependencies
```
npm install
```

4. Configure credentials
- Click [here] and select your firebase project
- Click on "Generate a new private key"
- Click on the "Generate key" button to download your private key file
- Place this file in the root of the cloned repository directory
- Run `npm run config` to rename and move your private key file correctly

## Usage

1. Configure the `config` object in the `src/config.ts` file to suit your needs [[HELP](#how-to-configure-the-config-object)]
2. If you are performing a `"push"` operation:
   - Format your data file correctly [[HELP](#how-to-format-your-data-file-for-a-"push"-operation)]
   - Place the file in the correct location based on your DATA_FILE_PATH specified in config
3. Run `npm run build` to compile the typescript (you should see a new `"dist"` folder being created in the repository root
4. Finally, run `npm run execute` to execute your `"pull"`/`"push"` operation


### How to configure the `config` object

#### Type
```ts
type Config = {
  OPERATION_TYPE: "pull" | "push";
  COLLECTION_PATH: string;
  DATA_FILE_PATH: string;
  
  // push-only configuration
  STRATEGY?: {
    ATOMIC: boolean;
    MERGE: boolean;
  };
};
```

#### Attributes
1. `OPERATION_TYPE`
   - Required
   - Set the value to `"pull"` if you want to read from the database
   - Set the value to `"push"` if you want to write to the database

2. `COLLECTION_PATH`
   - Required
   - This will be the path to the collection in firestore you want to perform `"pull"` or `"push"` on
   - If you want to reference a collection at the root, you may simply write the collection name
   - If you want to reference a sub-collection, you may write the path to the collection in the `collection/document/collection...`
   - Ensure that the last segment of your path is a collection name

3. `DATA_FILE_PATH`
   - Required
   - This is a relative path from the repository root directory to your data file
   - For a `"pull"` operation, this will be the path to the file the data will be written to
   - For a `"push"` operation, this will be the path to the file the data will be read from
   - NOTE: This file does not need to exist if you are performing a `"pull"` operation, however if there is a file with the same name at the specified location, it will be overwritten if the tool executes the `"pull"` successfully

4. `STRATEGY.ATOMIC`
   - Optional
   - Defaults to `false`
   - Only needs to be configured for `"push"` operations
   - If set to `true`, it will cancel all writes if a single write fails (atomic operation)
   - If set to `false`, it will perform all writes independent of whether others fail or not

4. `STRATEGY.MERGE`
   - Optional
   - Defaults to `false`
   - Only needs to be configured for `"push"` operations
   - If set to `true`, firestore will perform a document merge for any existing documents in the provided data
   - If set to `false`, firestore will perform a document overwrite any existing documents in the provided data

#### Example `pull` config
```ts
const config: Config = {
  OPERATION_TYPE: "pull",
  COLLECTION_PATH: "users/npBC2DtVcyZrkN3qQXNgFprpmSi1/chats",
  DATA_FILE_PATH: "./src/chats.json",
};
```

#### Example `push` config
```ts
const config: Config = {
  OPERATION_TYPE: "push",
  COLLECTION_PATH: "meetings",
  DATA_FILE_PATH: "./data.json",
  STRATEGY: {
    ATOMIC: false,
    MERGE: true,
  },
};
```

### How to format your data file for a `"push"` operation

- The file must be in [`JSON`](https://www.json.org/json-en.html) format
- The file must be an array of objects
- Each object may optionally include the related firestore document ID using the attribute name `"id"`
   - If the `"id"` attribute is included in the object
      - It may be used to reference an existing document
      - It may also be used to provide a custom ID to the newly created document
      - The `"id"` field will not be included in the contents of the newly created document
   - If the `"id"` attribute is not included in the object, firestore will autogenerate a 20 character case-sensitive alphanumeric id for the new document created for that object

#### Example Data File Contents

```json
[
  {
    "id": "npBC2DtVcyZrkN3qQXNgFprpmSi1",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  {
    "id": "QE1viHRWvlbbmXKzkIp801j1amx1",
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  },
  {
    "id": "DWOIu9yMtwV8V7fGe8XKSJcA7fz2",
    "name": "Bob Johnson",
    "email": "bob.johnson@example.com"
  }
]
```
