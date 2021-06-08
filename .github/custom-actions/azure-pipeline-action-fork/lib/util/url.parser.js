'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
class UrlParser {
  static GetProjectName(projectUrl) {
    if (this.IsNullOrEmpty(projectUrl)) {
      throw new Error(this.NullOrEmptyProjectUrl);
    }
    try {
      projectUrl = projectUrl.trim();
      this.EnsureProjectName(projectUrl);
      var index = projectUrl.lastIndexOf('/');
      var projectNamePart = projectUrl.substr(index + 1);
      var projectName = decodeURI(projectNamePart);
      if (projectName) {
        return projectName;
      } else {
        throw Error();
      }
    } catch (error) {
      var errorMessage = this.GetUrlParseExceptionMessage(projectUrl);
      throw new Error(errorMessage);
    }
  }
  static GetCollectionUrlBase(projectUrl) {
    if (this.IsNullOrEmpty(projectUrl)) {
      throw new Error(this.NullOrEmptyProjectUrl);
    }
    try {
      projectUrl = projectUrl.trim();
      var collectionUrl = projectUrl.substr(0, projectUrl.lastIndexOf('/'));
      if (collectionUrl) {
        return collectionUrl;
      } else {
        throw Error();
      }
    } catch (error) {
      var errorMessage = this.GetUrlParseExceptionMessage(projectUrl);
      throw new Error(errorMessage);
    }
  }
  static EnsureProjectName(projectUrl) {
    var index = projectUrl.lastIndexOf('/');
    if (index == projectUrl.length - 1) {
      throw Error();
    }
  }
  static GetUrlParseExceptionMessage(projectUrl) {
    let errorMessage = `Failed to parse project url: "${projectUrl}". Specify the valid project url (eg, https://dev.azure.com/organization/project-name or https://server.example.com:8080/tfs/DefaultCollection/project-name)) and try again.`;
    return errorMessage;
  }
  static IsNullOrEmpty(value) {
    return !value;
  }
}
exports.UrlParser = UrlParser;
UrlParser.NullOrEmptyProjectUrl = 'Project url is null or empty. Specify the valid project url and try again';
