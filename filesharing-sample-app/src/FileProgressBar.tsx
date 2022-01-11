import { ProgressIndicator } from '@fluentui/react';
import { useState, useEffect } from 'react';
import { UploadedFile } from './UploadedFile';

export interface FileProgressProps {
  uploadedFile: UploadedFile;
}

export const FileProgressBar = (props: FileProgressProps) => {
  const { uploadedFile } = props;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const uploadProgressedListener = (e: number) => {
      setProgress(e);
    };

    uploadedFile.on('uploadProgressed', uploadProgressedListener);

    return () => {
      uploadedFile.off('uploadProgressed', uploadProgressedListener);
    };
  }, [uploadedFile]);

  return (
    <ProgressIndicator
      percentComplete={progress}
      styles={{
        itemProgress: {
          height: 0,
          padding: '2px 0',
          borderRadius: '0 0 4px 4px'
        }
      }}
    />
  );
};
