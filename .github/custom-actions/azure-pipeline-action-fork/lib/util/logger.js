'use strict';
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
class Logger {
  static LogOutputUrl(url) {
    if (url) {
      core.setOutput('pipeline-url', url);
      core.info(`More details on triggered pipeline can be found here : "${url}"`);
    }
  }
  static LogInfo(message) {
    core.info(message);
  }
  static LogPipelineTriggered(pipelineName, projectName) {
    core.info(`\Pipeline '${pipelineName}' is triggered in project '${projectName}'`);
  }
  static LogPipelineObject(object) {
    core.debug('Pipeline object : ' + this.getPrintObject(object));
  }
  static LogPipelineTriggerInput(input) {
    core.debug('Input: ' + this.getPrintObject(input));
  }
  static LogPipelineTriggerOutput(output) {
    core.debug('Output: ' + this.getPrintObject(output));
  }
  static getPrintObject(object) {
    return JSON.stringify(object, null, 4);
  }
}
exports.Logger = Logger;
