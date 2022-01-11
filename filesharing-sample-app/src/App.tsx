import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React from 'react';
import './App.css';
import { FileCard } from './FileCard';
import { UploadedFile } from './UploadedFile';

initializeIcons();
initializeFileTypeIcons();

export type FileUploadHandler = (userId: string, uploadedFile: UploadedFile) => void;

/**
 *
 */
export const UploadButton = (props: { fileUploadHandler?: FileUploadHandler }): JSX.Element => {
  const userId = 'sampleUserId';

  const { fileUploadHandler } = props;

  const onChange = (files: FileList | null): void => {
    if (!files) {
      return;
    }

    for (const file of files) {
      const uploadedFile = new UploadedFile(file);
      fileUploadHandler && fileUploadHandler(userId, uploadedFile);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => {
        onChange(e.currentTarget.files);
      }}
    />
  );
};

// MOCK FILES
const files: UploadedFile[] = [];
for (let index = 0; index < 8; index++) {
  files.push(new UploadedFile(new File([], 'router-settings.docx')));
}

// SIMULATE FILE UPLOAD PROGRESS
// updateProgress function to be called by Contoso to update the file progress status.
// Files can not be sent with the message until all the files have a progress of 100.
setInterval(() => {
  for (let index = 0; index < files.length; index++) {
    files[index].updateProgress(Math.random());
  }
}, 1000);

// SAMPLE SENDBOX
function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto',
          padding: '10px'
        }}
      >
        {files.map((file, idx) => (
          <div key={idx} style={{ marginTop: '1rem' }}>
            <FileCard uploadedFile={file} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
