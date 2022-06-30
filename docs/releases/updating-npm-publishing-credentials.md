# Updating npm publishing credentials

Our GitHub actions that publish our npm package require keys and tokens for two places:

1. The Azure Blob Store that we upload the npm tarball to.
1. The ADO release pipeline that publishes tarball to npm.

For more information on these visit the internal wiki page: <https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline>.

## Required keys and tokens

1. `AZURESDKPARTNERDROPS_SERVICE_PRINCIPAL_KEY`. **⚠ This could be rotated at any time and need updating. ⚠** This is stored in the Azure key vault and requires permissions from a security group to access. Details for this can be found on the [internal wiki page](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline).

1. `AZURESDKPARTNERDROPS_CLIENT_ID`. This shouldn't change. This is the azure blob store client ID. This should be found on the [internal wiki page](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline).

1. `AZURESDKPARTNERDROPS_TENANT_ID`. This shouldn't change. This is the azure blob store tenant ID. This should be found on the [internal wiki page](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline).

1. `AZURE_SDK_RELEASE_PIPELINE_DEVOPS_TOKEN`. **⚠ This will expire periodically and need updating ⚠**. This is a personal access token. An account with access to the [ADO release pipeline](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline) should create a new access token when the old one expires. To gain access to this release page you must belong to the appropriate security group; follow the instructions on the [internal wiki page](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline). For more information on how to create a personal access token see: [Use personal access tokens - Create a PAT](https://docs.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops#create-a-pat).
