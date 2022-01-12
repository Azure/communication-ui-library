import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React, { useEffect } from 'react';
import './App.css';
import { FileCard } from './file-sharing/FileCard';
import { FileUploadButton } from './file-sharing/FileUploadButton';
import { UploadedFile, FileMetaData } from './file-sharing/UploadedFile';

initializeIcons();
initializeFileTypeIcons();

// MOCK FILES
// const files: UploadedFile[] = [];
// for (let index = 0; index < 8; index++) {
//   files.push(new UploadedFile(new File([], 'router-settings.docx')));
// }

// SIMULATE FILE UPLOAD PROGRESS
// updateProgress function to be called by Contoso to update the file progress status.
// Files can not be sent with the message until all the files have a progress of 100.
// setInterval(() => {
//   for (let index = 0; index < files.length; index++) {
//     files[index].updateProgress(Math.random());
//   }
// }, 1000);

// SAMPLE SENDBOX
function App() {
  const [files, setFiles] = React.useState<UploadedFile[]>();
  const [allFilesUploaded, setAllFilesUploaded] = React.useState(false);

  // This logic needs to be in the internal selectors.
  useEffect(() => {
    if (!files) return;

    const uploadCompleteListener = (metaData: FileMetaData) => {
      console.log('uploadCompleteListener', metaData);
      for (const file of files) {
        if (!file.isUploaded()) {
          return;
        }
      }
      setAllFilesUploaded(true);
      console.log('ALL FILES UPLOADED');
    };

    files.forEach((file) => {
      file.on('uploadCompleted', uploadCompleteListener);
    });

    return () => {
      files.forEach((file) => {
        file.off('uploadCompleted', uploadCompleteListener);
      });
    };
  }, [files]);

  // CONTOSO File Upload Handler
  const fileUploadHandler = async (userId: string, uploadedFiles: UploadedFile[]) => {
    // This code needs to be handled by an internal handler for updating the state of the app.
    // This state can then be accessed by selectors for rendering the files in the sendbox.
    setFiles(uploadedFiles);

    // Simulate uploading the file to a server
    for (const file of uploadedFiles) {
      let progress = 0;
      for (let index = 0; index < 20; index++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        progress += 0.05;
        file.updateProgress(progress);
      }
      // Mark file upload as complete
      file.completeUpload({
        name: file.file.name,
        extension: file.extension(),
        url: 'https://www.google.com'
      });
    }
  };

  // @TODO: Write logic to identify that all files have been uploaded

  return (
    <div style={{ padding: '2rem' }}>
      <div>
        <FileUploadButton userId="123456" fileUploadHandler={fileUploadHandler} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto',
          padding: '10px'
        }}
      >
        {files &&
          files.map((file, idx) => (
            <div key={idx} style={{ marginTop: '1rem' }}>
              <FileCard uploadedFile={file} />
            </div>
          ))}
      </div>

      <br />

      {allFilesUploaded && <div>All files uploaded</div>}

      <br />

      {allFilesUploaded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto auto',
            padding: '10px'
          }}
        >
          {files &&
            files.map((file, idx) => (
              <div key={idx} style={{ marginTop: '1rem' }}>
                <FileCard uploadedFile={file} downloadable />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
