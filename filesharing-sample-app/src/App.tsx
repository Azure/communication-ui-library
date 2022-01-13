import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { PrimaryButton } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React, { useEffect } from 'react';
import './App.css';
import { FileCard } from './file-sharing/FileCard';
import { FileCardGroup } from './file-sharing/FileCardGroup';
import { FileUploadButton } from './file-sharing/FileUploadButton';
import { UploadedFile, FileMetaData } from './file-sharing/UploadedFile';

initializeIcons();
initializeFileTypeIcons();

// SAMPLE SENDBOX
function App() {
  const [files, setFiles] = React.useState<UploadedFile[]>();
  const [allFilesUploaded, setAllFilesUploaded] = React.useState(false);
  const [messageSent, setMessageSent] = React.useState(false);

  // This logic needs to be in the internal selectors + handler.
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

  const uploadedFileCards = () => {
    return (
      <FileCardGroup>
        {files?.map((file, idx) => (
          <FileCard uploadedFile={file} key={idx} />
        ))}
      </FileCardGroup>
    );
  };

  const downloadableFileCards = () => {
    return (
      <FileCardGroup>
        {files && files.map((file, idx) => <FileCard uploadedFile={file} downloadable key={idx} />)}
      </FileCardGroup>
    );
  };

  // @TODO: Write logic to identify that all files have been uploaded

  return (
    <div style={{ padding: '2rem' }}>
      <div>
        <p>
          <b>Select Files</b>
        </p>
        <li>Clicking on upload file button opens the OS file picker.</li>
        <li>Multiple files can be selected</li>
        <li>Contoso can provide file extensions to limit the type of files that can be picked</li>
        <br />
        <FileUploadButton userId="123456" fileUploadHandler={fileUploadHandler} />
      </div>

      <br />
      <br />

      {files && (
        <div>
          <p>
            <b>Upload</b>
          </p>

          <li>Files added to SendBox.</li>
          <li>Files are set in ChatAdapter UI State</li>
          <li>Contoso provided `uploadHandler` function called for each file.</li>
          <li>Contoso calls `uploadedFile.updateProgress()` to fill the progress bar.</li>
          <li>Contoso calls `uploadedFile.completeUpload()` for each uploaded file to mark the upload as complete.</li>
          <li>
            Once all the files are uploaded, the entire upload is marked as complete. Handled by an internal selector.
          </li>
          <li>
            Files MetaData added to the message `metadata` attribute. {files && JSON.stringify(files[0].metaData)}
          </li>
          {uploadedFileCards()}
        </div>
      )}

      <br />
      <br />

      {allFilesUploaded && (
        <div>
          <p>
            <b>Send Message with MetaData</b>
          </p>
          <li>Message can only be sent once all the files have been marked as complete by Contoso</li>
          <br />
          {<PrimaryButton onClick={() => setMessageSent(true)}>Send Message</PrimaryButton>}
        </div>
      )}

      <br />
      <br />

      {messageSent && (
        <div>
          <p>
            <b>Display Files in Message Thread</b>
          </p>

          <li>
            File MetaData is used to display the file card in message thread. `metadata.extension` is used for the icon.
          </li>
          <li>Clicking anywhere on the file opens `metadata.url` link in a new tab.</li>
          <li>
            @TODO: How to handle file permissions. Contoso may need to generate a user specific file url or deny access
            to the file entirely.
          </li>
        </div>
      )}
      {messageSent && downloadableFileCards()}
    </div>
  );
}

export default App;
