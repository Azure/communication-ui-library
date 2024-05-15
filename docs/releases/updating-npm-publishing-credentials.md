# Updating npm publishing credentials

Our GitHub actions that publish our npm package require access for two places:

1. The Azure Blob Store that we upload the npm tarball to.
1. The ADO release pipeline that publishes tarball to npm.

For more information on these visit the internal wiki page: <https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline>.

## Required keys and tokens

1. `AZURE_SDK_RELEASE_PIPELINE_DEVOPS_TOKEN`. **⚠ This will expire periodically and need updating ⚠**. This is a personal access token. An account with access to the [ADO release pipeline](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline) should create a new access token when the old one expires. To gain access to this release page you must belong to the appropriate security group; follow the instructions on the [internal wiki page](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline). For more information on how to create a personal access token see: [Use personal access tokens - Create a PAT](https://docs.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops#create-a-pat).
    * Request access to release pipelines through `myaccess`, Request for project Azure SDK Partners. Link can also be found in the [internal wiki page](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline)
    * PAT Token should have the following scope:
        * Release (Read, write, & execute)
        * Code (Read, write)
        * Build (Read, execute)

1. `NPM_DEPLOY_AZURE_CLIENT_ID`, `NPM_DEPLOY_AZURE_TENANT_ID` and `NPM_DEPLOY_AZURE_SUBSCRIPTION_ID`. These shouldn't change. They are the OIDC (OpenID Connect) details that are used to authenticate access to Azure Blob Store. See [internal documenatation](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/49092/Updating-npm-publishing-credentials) for more details.

# Troubleshooting

1. If you experience a 401 error, try rotating AZURE_SDK_RELEASE_PIPELINE_DEVOPS_TOKEN and rerun the job.
