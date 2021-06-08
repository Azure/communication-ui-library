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
const task_parameters_1 = require('./task.parameters');
const pipeline_runner_1 = require('./pipeline.runner');
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const pipelineRunner = new pipeline_runner_1.PipelineRunner(task_parameters_1.TaskParameters.getTaskParams());
      core.debug('Starting pipeline runner');
      yield pipelineRunner.start();
      core.debug('pipeline runner completed');
    } catch (error) {
      const errorMessage = JSON.stringify(error);
      core.setFailed(`Error: "${error.message}" Details: "${errorMessage}"`);
    }
  });
}
exports.main = main;
main();
