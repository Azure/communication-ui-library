# Do verify UI snapshots carefully

We have [serveral browser tests](../references/automated-tests.md) in the repository that compare UI snapshots against golden files. These golden files need to be updated whenever a Pull Request changes existing UI, or adds browser tests with new snapshots.

Carefully review these snapshot updates. The browser tests are only as good as the checked in snapshots, and any incorrect updates that slip through the Pull Request review process give us false confidence in the quality of our product.

One example led to a [critical issue 🕷️](https://github.com/Azure/communication-ui-library/issues/2186) that had to be fixed by a [hotfix release to the stable package 😓](https://github.com/Azure/communication-ui-library/blob/7d276116ce0b5aab82b1adc3e24b32709b0db47c/packages/communication-react/CHANGELOG.md).

As a reviewer:

- For Pull Requests that may need a UI snapshot update, do not approve the Pull Request until the snapshots have been updated.
- Carefully review snapshot updates:
  - Are the changes consistent with the code changes in the Pull Request?
  - Are there unrelated changes in the snapshot? If yes, try to figure out why (with the help of the Pull Request author).
    - Is it because the Pull Request introduces some unintended CSS artifacts? Are those artifacts worth fixing?
    - Is this a flaky browser test which causes spurious snapshot differences? Flaky tests are almost always worth fixing because they reduce our confidence in Continuous Integration tests and lead to bugs slipping through the cracks.
  - It can be hard to review snapshot differences if there are many changed snapshots.
    - Are the differences functionally small, i.e., same / similar difference in many files? If not, consider requesting the author to break up their Pull Request into smaller chunks.
    - For functionally small differences that touch many files, spot check a large enough sample of the files.
