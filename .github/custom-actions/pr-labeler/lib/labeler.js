'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const core = __importStar(require('@actions/core'));
const github = __importStar(require('@actions/github'));
const yaml = __importStar(require('js-yaml'));
const minimatch_1 = require('minimatch');
function run() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const token = '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'; //core.getInput("repo-token", { required: true });
      const configPath = 'common/config/pr-labeler/pr-labeler-config.yml'; //core.getInput("configuration-path", { required: true });
      const syncLabels = true; //!!core.getInput("sync-labels", { required: false });
      const onlyLastCommit = true; //!!core.getInput("compare-last-commit-only", { required: false });
      const prNumber = 444; //getPrNumber();
      if (!prNumber) {
        console.log('Could not get pull request number from context, exiting');
        return;
      }
      const client = new github.GitHub(token);
      console.log('github.context.payload');
      console.log(github.context.action);
      console.log(github.context.payload.pull_request);
      const { data: pullRequest } = yield client.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber
      });
      core.debug(`fetching changed files for pr #${prNumber}`);
      const changedFiles = yield getChangedFiles(client, prNumber, onlyLastCommit);
      const labelGlobs = yield getLabelGlobs(client, configPath);
      const labels = [];
      const labelsToRemove = [];
      for (const [label, globs] of labelGlobs.entries()) {
        core.debug(`processing ${label}`);
        if (checkGlobs(changedFiles, globs)) {
          labels.push(label);
        } else if (pullRequest.labels.find((l) => l.name === label)) {
          labelsToRemove.push(label);
        }
      }
      if (labels.length > 0) {
        yield addLabels(client, prNumber, labels);
      }
      if (syncLabels && labelsToRemove.length) {
        yield removeLabels(client, prNumber, labelsToRemove);
      }
    } catch (error) {
      core.error(error);
      core.setFailed(error.message);
    }
  });
}
exports.run = run;
function getPrNumber() {
  const pullRequest = github.context.payload.pull_request;
  if (!pullRequest) {
    return undefined;
  }
  return pullRequest.number;
}
function getChangedFiles(client, prNumber, onlyLastCommit) {
  return __awaiter(this, void 0, void 0, function* () {
    let changedFiles = [];
    if (onlyLastCommit) {
      const prCommits = (yield client.pulls.listCommits({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber
      })).data;
      const latestCommitRef = prCommits[prCommits.length - 1];
      console.log('latest commit: ' + latestCommitRef.commit.message);
      const commitFiles = (yield client.repos.getCommit({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: latestCommitRef.sha
      })).data.files;
      console.log('found commit files:');
      for (const file of commitFiles) {
        console.log('  ' + file.filename);
      }
      changedFiles = commitFiles.map((f) => f.filename);
    } else {
      const listFilesOptions = client.pulls.listFiles.endpoint.merge({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber
      });
      const listFilesResponse = yield client.paginate(listFilesOptions);
      changedFiles = listFilesResponse.map((f) => f.filename);
    }
    core.debug('found changed files:');
    for (const file of changedFiles) {
      core.debug('  ' + file);
    }
    return changedFiles;
  });
}
function getLabelGlobs(client, configurationPath) {
  return __awaiter(this, void 0, void 0, function* () {
    const configurationContent = yield fetchContent(client, configurationPath);
    // loads (hopefully) a `{[label:string]: string | StringOrMatchConfig[]}`, but is `any`:
    const configObject = yaml.safeLoad(configurationContent);
    // transform `any` => `Map<string,StringOrMatchConfig[]>` or throw if yaml is malformed:
    return getLabelGlobMapFromObject(configObject);
  });
}
function fetchContent(client, repoPath) {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield client.repos.getContents({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      path: repoPath,
      ref: github.context.sha
    });
    return Buffer.from(response.data.content, response.data.encoding).toString();
  });
}
function getLabelGlobMapFromObject(configObject) {
  const labelGlobs = new Map();
  for (const label in configObject) {
    if (typeof configObject[label] === 'string') {
      labelGlobs.set(label, [configObject[label]]);
    } else if (configObject[label] instanceof Array) {
      labelGlobs.set(label, configObject[label]);
    } else {
      throw Error(`found unexpected type for label ${label} (should be string or array of globs)`);
    }
  }
  return labelGlobs;
}
function toMatchConfig(config) {
  if (typeof config === 'string') {
    return {
      any: [config]
    };
  }
  return config;
}
function printPattern(matcher) {
  return (matcher.negate ? '!' : '') + matcher.pattern;
}
function checkGlobs(changedFiles, globs) {
  for (const glob of globs) {
    core.debug(` checking pattern ${JSON.stringify(glob)}`);
    const matchConfig = toMatchConfig(glob);
    if (checkMatch(changedFiles, matchConfig)) {
      return true;
    }
  }
  return false;
}
exports.checkGlobs = checkGlobs;
function isMatch(changedFile, matchers) {
  core.debug(`    matching patterns against file ${changedFile}`);
  for (const matcher of matchers) {
    core.debug(`   - ${printPattern(matcher)}`);
    if (!matcher.match(changedFile)) {
      core.debug(`   ${printPattern(matcher)} did not match`);
      return false;
    }
  }
  core.debug(`   all patterns matched`);
  return true;
}
// equivalent to "Array.some()" but expanded for debugging and clarity
function checkAny(changedFiles, globs) {
  const matchers = globs.map((g) => new minimatch_1.Minimatch(g));
  core.debug(`  checking "any" patterns`);
  for (const changedFile of changedFiles) {
    if (isMatch(changedFile, matchers)) {
      core.debug(`  "any" patterns matched against ${changedFile}`);
      return true;
    }
  }
  core.debug(`  "any" patterns did not match any files`);
  return false;
}
// equivalent to "Array.every()" but expanded for debugging and clarity
function checkAll(changedFiles, globs) {
  const matchers = globs.map((g) => new minimatch_1.Minimatch(g));
  core.debug(` checking "all" patterns`);
  for (const changedFile of changedFiles) {
    if (!isMatch(changedFile, matchers)) {
      core.debug(`  "all" patterns did not match against ${changedFile}`);
      return false;
    }
  }
  core.debug(`  "all" patterns matched all files`);
  return true;
}
function checkMatch(changedFiles, matchConfig) {
  if (matchConfig.all !== undefined) {
    if (!checkAll(changedFiles, matchConfig.all)) {
      return false;
    }
  }
  if (matchConfig.any !== undefined) {
    if (!checkAny(changedFiles, matchConfig.any)) {
      return false;
    }
  }
  return true;
}
function addLabels(client, prNumber, labels) {
  return __awaiter(this, void 0, void 0, function* () {
    yield client.issues.addLabels({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: prNumber,
      labels: labels
    });
  });
}
function removeLabels(client, prNumber, labels) {
  return __awaiter(this, void 0, void 0, function* () {
    yield Promise.all(
      labels.map((label) =>
        client.issues.removeLabel({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: prNumber,
          name: label
        })
      )
    );
  });
}
