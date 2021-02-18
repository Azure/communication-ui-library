// © Microsoft Corporation. All rights reserved.

// Project settings
export const GUID_FOR_INITIAL_TOPIC_NAME = 'c774da81-94d5-4652-85c7-6ed0e8dc67e6';

// Project configurations
export const THREAD_INFO_FETCH_INVERVAL = 2000;
export const COOL_PERIOD_REFRESH_INVERVAL = 1000;
export const COOL_PERIOD_THRESHOLD = 60 * 1000;
export const PRECONDITION_FAILED_RETRY_INTERVAL = 200;
export const INITIAL_MESSAGES_SIZE = 2000;
export const MAXIMUM_LENGTH_OF_NAME = 10;
export const MAXIMUM_LENGTH_OF_MESSAGE = 8000;
export const MAXIMUM_LENGTH_OF_TOPIC = 30;
export const MAXIMUM_LENGTH_OF_TYPING_USERS = 35;
export const MAXIMUM_RETRY_COUNT = 3;
export const MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS = 8000;
export const MAXIMUM_INT64 = 9223372036854775807;
export const DEFAULT_NUMBER_OF_MESSAGES_TO_LOAD = 100;
export const PAGE_SIZE = 200;
export const PARTICIPANTS_THRESHOLD = 20;

// Keyboard keys
export const ENTER_KEY = 13;
export const SPACE_KEY = 32;

// Http Status Code
export const OK = 200;
export const CREATED = 201;
export const NO_CONTENT = 204;
export const MULTI_STATUS = 207;
export const UNAUTHORIZED_STATUS_CODE = 401;
export const FORBIDDEN_STATUS_CODE = 403;
export const PRECONDITION_FAILED_STATUS_CODE = 412;
export const TOO_MANY_REQUESTS_STATUS_CODE = 429;
export const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;
export const SERVICE_UNAVAILABLE_STATUS_CODE = 503;

// Regex
export const EMPTY_MESSAGE_REGEX = /^\s*$/;

// Message Type
export const TEXT_MESSAGE = 'Text';

// String constants
export const CLICK_TO_LOAD_MORE_MESSAGES = 'click to load more messages...';
export const UNABLE_TO_LOAD_MORE_MESSAGES = 'You have reached the beginning of the thread';
export const NEW_MESSAGES = 'New Messages';
export const TEXT_EXCEEDS_LIMIT = `Your message is over the limit of ${MAXIMUM_LENGTH_OF_MESSAGE} characters`;
