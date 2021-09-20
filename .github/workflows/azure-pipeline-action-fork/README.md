**NOTE: THIS IS A FORK OF https://github.com/Azure/pipelines.**

**THIS SHOULD BE REMOVED ONCE https://github.com/Azure/pipelines/pull/11 AND https://github.com/Azure/pipelines/pull/34 ARE COMPLETED.**

**FORK CONTENTS: https://github.com/JamesBurnside/pipelines/tree/jaburnsi/fixes-for-automated-alpha-release**

# GitHub Action to trigger a run in Azure pipelines

GitHub Actions makes it easy to build, test, and deploy your code right from GitHub. 

However, if you would like to use your GH Action workflows just for CI and for CD, continue to use your favorite [Azure Pipelines](https://azure.microsoft.com/en-in/services/devops/pipelines/) with all the best-in-class features needed to enable compliant, safe deployments to their prod Environments, it is quite possible with this azure/pipelines action.

With this action, you could trigger an Azure pipeline run right from inside an Action workflow.

The definition of this Github Action is in [action.yml](https://github.com/Azure/pipelines/blob/master/action.yml).

## Sample workflow 

Use this action to trigger a specific pipeline (YAML or Classic Release Pipeline) in an Azure DevOps organization.
Action takes Project URL, pipeline name and a [Personal Access Token (PAT)](https://docs.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops) for your DevOps account.

```yaml
- uses: Azure/pipelines@v1
  with:
    azure-devops-project-url: 'https://dev.azure.com/organization/project-name'
    azure-pipeline-name: 'pipeline-name' # name of the Azure pipeline to be triggered
    azure-devops-token: '${{ secrets.AZURE_DEVOPS_TOKEN }}'
    azure-pipeline-variables:  '{"variable1": "value1", "variable2": "value2"}' # optional stringified json
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
