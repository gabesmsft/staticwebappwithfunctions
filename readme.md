# Static Web App with a .NET 10 API

A **No Framework** HTML/CSS/JavaScript frontend based on
[staticwebdev/vanilla-basic](https://github.com/staticwebdev/vanilla-basic),
with a managed Azure Functions v4 API using **.NET 10 isolated worker**.
The frontend calls the same-origin `GET /api/message` endpoint and displays:

```json
{ "text": "Hello from .NET 10 Azure Functions!" }
```

## Project layout

- [src](src): static frontend; no frontend build is needed.
- [api](api): .NET 10 isolated Functions project.
- [Runtime configuration](src/staticwebapp.config.json): selects `dotnet-isolated:10.0`.
- [GitHub Actions workflow](.github/workflows/azure-static-web-apps.yml): tests,
  publishes the API with the .NET 10 SDK, deploys both parts, and smoke tests the site.

The API is anonymous, as in the tutorial. Do not put sensitive data in this
endpoint without adding authorization.

## Local development

Install Node.js 22+, the .NET 10 SDK, and Azure Functions Core Tools v4 with
.NET 10 support. From the repository root in PowerShell:

```powershell
Copy-Item api\local.settings.example.json api\local.settings.json
npm start
```

Open `http://localhost:4280`. The SWA CLI starts the static frontend and Functions
API together. The first run downloads the SWA CLI through `npx`.
This HTTP-only API does not require Azurite or a storage account.
Local settings are ignored by Git.

```powershell
npm test
dotnet build api\api.csproj --configuration Release
$env:APP_URL = "http://localhost:4280"
npm run test:smoke
```

## Azure deployment

| Setting | Value |
| --- | --- |
| Subscription | `4f42d231-1050-4386-b5ca-54cc38d11edf` |
| Resource group | `gabesfakerg1` |
| Static Web App | `gfakeswawithapi1` |
| Region | East US 2 |
| Plan | Free |
| Repository | `gabesmsft/staticwebappwithfunctions` |
| Production branch | `main` |
| Build preset | No Framework |
| App source location | `src` |
| API source location | `api` |
| Frontend output location | Empty |

No separate Function App is required. The workflow publishes the API explicitly
and uploads `artifacts/api` with `skip_api_build: true`, avoiding dependence on
the deployment image's installed .NET SDK.

For a fresh resource, create it and configure the repository secret using Azure
CLI and GitHub CLI (authenticate both first):

```powershell
az staticwebapp create --name gfakeswawithapi1 --resource-group gabesfakerg1 --subscription 4f42d231-1050-4386-b5ca-54cc38d11edf --location eastus2 --sku Free --app-location src --api-location api --tags Purpose=Manual
az staticwebapp secrets list --name gfakeswawithapi1 --resource-group gabesfakerg1 --subscription 4f42d231-1050-4386-b5ca-54cc38d11edf --query properties.apiKey --output tsv | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo gabesmsft/staticwebappwithfunctions
```

Push to `main` or run the workflow manually to deploy. The deployment token is
stored only as a GitHub Actions secret, never in source control.

## References

- [Create a Static Web App (vanilla JavaScript)](https://learn.microsoft.com/en-us/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
- [Add an API](https://learn.microsoft.com/en-us/azure/static-web-apps/add-api?tabs=vanilla-javascript)
- [Supported runtimes, including .NET 10 isolated](https://learn.microsoft.com/en-us/azure/static-web-apps/languages-runtimes#api)