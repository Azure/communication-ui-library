# Updating npm publishing credentials

**Update: we now used Managed Identities for authentication. As such we no longer have personal access tokens that need rotated regularly.**

Our GitHub actions that publish our npm package require access for two places:

1. The Azure Blob Store that we upload the npm tarball to.
1. The ADO release pipeline that publishes tarball to npm.

Both of these use OpenID Connect tokens for authentication. To authorize OIDC tokens the following GitHub secrets need set:

- `NPM_DEPLOY_AZURE_CLIENT_ID`
- `NPM_DEPLOY_AZURE_TENANT_ID`
- `NPM_DEPLOY_AZURE_SUBSCRIPTION_ID`.

These shouldn't change. See [internal documenatation](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/49092/Updating-npm-publishing-credentials) for more details where these are and how they are used for authorization.
