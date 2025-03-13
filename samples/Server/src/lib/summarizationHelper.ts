// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getLanguageAPIKey } from './envHelper';

/**
 * Information on how this URL is contructued here: https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/how-to/conversation-summarization
 */
const API_URL =
  'https://<your-language-resource-endpoint>/language/analyze-conversations/jobs?api-version=2023-11-15-preview';

const apiHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Ocp-Apim-Subscription-Key': getLanguageAPIKey()
});

const Job_Poll_Time_Ms = 3000;

export type ConversationSummaryInput = {
  author: string;
  text: string;
}[];

export type SummarizeRestRequestResponse = {
  jobUrl: string;
};

/**
 * The response from the job status request.
 * This is a simplified version of the actual response.
 * See https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/how-to/conversation-summarization
 */
export type JobRestResponse = {
  status: 'InProgress' | 'Succeeded' | 'Failed';
  tasks?: {
    kind?: string;
    status?: string;
    taskName?: string;
    results?: {
      conversations: {
        summaries: {
          aspect: string;
          text?: string;
        }[];
      }[];
    };
  }[];
};

export type SummarizeResult = {
  recap: string;
  chapters: {
    chapterTitle: string;
    narrative: string;
  }[];
};

export async function SummarizeConversation(input: ConversationSummaryInput): Promise<SummarizeResult> {
  const requestResponse = await requestConversationSummary(input as unknown as ConversationSummaryInput);
  console.log('Request response:', requestResponse);

  const jobResult = await pollJobStatus(requestResponse.jobUrl);
  console.log('Job result:', jobResult);

  if (jobResult.status === 'Failed') {
    throw new Error('Job failed');
  }

  if (!jobResult.tasks) {
    throw new Error('Tasks not found');
  }
  if (jobResult.tasks[0].status !== 'succeeded') {
    throw new Error('Chapters Task failed');
  }
  if (jobResult.tasks[1].status !== 'succeeded') {
    throw new Error('Narratives Task failed');
  }
  if (jobResult.tasks[2].status !== 'succeeded') {
    throw new Error('Recaps Task failed');
  }

  const chapters = jobResult.tasks[0].results?.conversations[0].summaries.map((summary) => summary.text ?? '') ?? [];
  const narratives = jobResult.tasks[1].results?.conversations[0].summaries.map((summary) => summary.text ?? '') ?? [];
  const recap = jobResult.tasks[2].results?.conversations[0].summaries[0].text ?? '';

  const summarization = {
    recap: recap,
    chapters: chapters.map((chapter, index) => ({
      chapterTitle: chapter,
      narrative: narratives[index]
    }))
  };
  console.log('Summarization:', summarization);

  return summarization;
}

/**
 * Request a meeting summary from the Language API.
 * This could be replaced another service, such as Azure OpenAI.
 * @returns the summary of the transcription which includes the recap and chapters.
 */
const requestConversationSummary = async (input: ConversationSummaryInput): Promise<SummarizeRestRequestResponse> => {
  /**
   * The request body is a JSON object that contains the following properties:
   * - displayName: A string that represents the name of the conversation task.
   * - analysisInput: An object that contains the conversation items.
   * - tasks: An array of task objects that define the tasks to be performed on the conversation items.
   * Each task object contains the following properties:
   *   - taskName: A string that represents the name of the task.
   *   - kind: A string that represents the type of task.
   *   - parameters: An object that contains the parameters for the task.
   *     - summaryAspects: An array of strings that represent the aspects of the summary to be generated.
   * The response will contain the operation location URL, which can be used to poll for the job status.
   */
  const requestData = JSON.stringify({
    displayName: 'Conversation Task Example',
    analysisInput: {
      conversations: [
        {
          conversationItems: input.map((item, index) => ({
            text: item.text,
            id: index.toString(),
            role: 'Customer',
            participantId: item.author
          })),
          modality: 'text',
          id: 'conversation1'
        }
      ]
    },
    tasks: [
      {
        taskName: 'Conversation Task 1',
        kind: 'ConversationalSummarizationTask',
        parameters: {
          summaryAspects: ['chapterTitle']
        }
      },
      {
        taskName: 'Conversation Task 2',
        kind: 'ConversationalSummarizationTask',
        parameters: {
          summaryAspects: ['narrative']
        }
      },
      {
        taskName: 'Conversation Task 3',
        kind: 'ConversationalSummarizationTask',
        parameters: {
          summaryAspects: ['recap']
        }
      }
    ]
  });

  console.log('Request data:', requestData);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: apiHeaders(),
    body: requestData
  });
  console.log('Response:', response);

  if (!response.ok) {
    console.error('Response Failed: ', response.statusText);
    throw new Error('Summarization request failed');
  }

  const operationLocation = response.headers.get('Operation-Location');
  console.log('Operation location:', operationLocation);

  if (!operationLocation) {
    throw new Error('Operation location not found');
  }

  return {
    jobUrl: operationLocation
  };
};

/**
 * Poll the job status until it is no longer "InProgress".
 * @param jobUrl The URL of the job to poll.
 * @returns The job result.
 */
const pollJobStatus = async (jobUrl: string): Promise<JobRestResponse> => {
  let jobResult = await fetchJobResult(jobUrl);

  while (jobResult.status === 'InProgress') {
    await new Promise((resolve) => setTimeout(resolve, Job_Poll_Time_Ms));
    jobResult = await fetchJobResult(jobUrl);
  }

  return jobResult;
};

/**
 * Fetch the job result from the Language API.
 * @param jobUrl The URL of the job to fetch.
 * @returns The job result.
 */
const fetchJobResult = async (jobUrl: string): Promise<JobRestResponse> => {
  const response = await fetch(jobUrl, {
    method: 'GET',
    headers: apiHeaders()
  });

  const responseBody = await response.json();
  console.log('Response body:', responseBody);

  if (responseBody.status === 'running' || responseBody.status === 'notStarted' || responseBody.status === 'queued') {
    return {
      status: 'InProgress',
      tasks: responseBody.tasks.items
    };
  } else if (responseBody.status === 'succeeded') {
    return {
      status: 'Succeeded',
      tasks: responseBody.tasks.items
    };
  } else {
    return {
      status: 'Failed'
    };
  }
};
