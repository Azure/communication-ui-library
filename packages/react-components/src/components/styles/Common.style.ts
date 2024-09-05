// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @private
 */
export const scrollbarStyles = {
  '::-webkit-scrollbar, *::-webkit-scrollbar': {
    width: '0.3rem',
    height: '0.3rem'
  },
  '::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: 'rgba(150, 150, 150)'
  }
};

const ERROR_IMAGE_SVG_PATH =
  'M2.85 2.15a.5.5 0 1 0-.7.7l1.4 1.41A2.99 2.99 0 0 0 3 6v8a3 3 0 0 0 3 3h8c.65 0 1.25-.2 1.74-.55l1.4 1.4a.5.5 0 0 0 .71-.7l-15-15Zm6.56 7.97a1.5 1.5 0 0 0-.46.31l-4.67 4.59A2 2 0 0 1 4 14V6a2 2 0 0 1 .28-1.02l5.13 5.14ZM6 16a2 2 0 0 1-1.01-.27l4.66-4.58c.2-.2.5-.2.7 0l4.66 4.58A2 2 0 0 1 14 16H6ZM16 6v7.88l.9.9A3 3 0 0 0 17 14V6a3 3 0 0 0-3-3H6a3 3 0 0 0-.78.1l.9.9H14a2 2 0 0 1 2 2Zm-2 1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Zm-1 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z';

/**
 * @private
 */
export const BROKEN_IMAGE_SVG_DATA = `data:image/svg+xml,%3Csvg width='3rem' height='3rem' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='currentColor'%3E%3Cpath d='${ERROR_IMAGE_SVG_PATH}' fill='currentColor' /%3E%3C/svg%3E`;
