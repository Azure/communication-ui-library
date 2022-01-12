import { Icon, mergeStyles, Stack } from '@fluentui/react';
import { useRef } from 'react';
import { UploadedFile } from './UploadedFile';

export type FileUploadHandler = (userId: string, uploadedFiles: UploadedFile[]) => void;

export interface FileUploadButtonProps {
  userId: string;
  fileUploadHandler?: FileUploadHandler;
  accept?: string;
}

export const FileUploadButton = (props: FileUploadButtonProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { userId, fileUploadHandler, accept } = props;

  const onChange = (files: FileList | null): void => {
    if (!files) {
      return;
    }

    console.log('FILES ADDED: ', files);
    const uploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      const uploadedFile = new UploadedFile(file);
      uploadedFiles.push(uploadedFile);
    }

    console.log('UPLOADED FILES: ', uploadedFiles);
    // @TODO: Need to call an internal handler here as well that can add these files to our app state
    // This app state can be then accessed by selectors for rendering these files inside the sendbox.
    fileUploadHandler && fileUploadHandler(userId, uploadedFiles);
  };

  const onClick = () => {
    inputRef.current!.click();
  };

  const inputElement = (
    <input
      ref={inputRef}
      hidden
      multiple
      accept={accept}
      type="file"
      onChange={(e) => {
        onChange(e.currentTarget.files);
      }}
    />
  );

  return (
    <div>
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        className={mergeStyles({
          width: '1.5rem',
          height: '1.5rem',
          cursor: 'pointer',
          padding: '0.15rem',
          ':hover': {
            backgroundColor: '#eaeaea'
          }
        })}
        onClick={onClick}
      >
        <Icon iconName="Attach" />
      </Stack>
      {inputElement}
    </div>
  );
};
