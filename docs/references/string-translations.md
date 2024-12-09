# String translations

[@azure/communication-react](https://www.npmjs.com/package/@azure/communication-react) includes translations of all strings used internally to a set of supported languages.

We use a Microsoft internal translation service for string translations. Strings are automatically sent for translation when pushed to main. This is done via an internal Azure Pipeline.

**Strings are not committed back into the repository automatically**. This is to avoid surprises due to mis-translated strings and so that test snapshots can be updated to reflect the new strings.

## Pulling strings back to the repo

To pull strings back to the repo:

- Run the [internal Azure pipeline](https://skype.visualstudio.com/SCC/_apps/hub/ms.vss-build-web.ci-designer-hub?pipelineId=11254&branch=main) manually and select `Commit strings to GitHub`.
![image](https://github.com/user-attachments/assets/f72ef185-153c-4cbb-a329-dbaf29854ee2)
![image](https://github.com/user-attachments/assets/62e96b46-513a-402a-98f7-1933ff840681)
  - This will create a branch called `td/new-strings-<datetime>` with the new strings.
  - This pipeline can be run off any branch and the strings will be translated from that branch. We typically run it off `main` or a `release` branch.
- Then create a PR to merge this branch into your desired branch.

## References

Further reading: [Internal documentation](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/25949/Localization) for details on how string translation service is setup.
