import { Icon, mergeStyles, Stack } from '@fluentui/react';
import { UploadedFile } from './UploadedFile';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { FileProgressBar } from './FileProgressBar';

export interface FileCardProps {
  uploadedFile: UploadedFile;
  /**
   * If true, features like upload progress and cancel button will not be shown.
   * Default value is false;
   */
  downloadable?: boolean;
}

export const FileCard = (props: FileCardProps) => {
  const { uploadedFile, downloadable } = props;
  return (
    <Stack
      className={mergeStyles({
        width: '14rem',
        background: '#F3F2F1',
        borderRadius: '4px',
        boxShadow: '0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)'
      })}
    >
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        className={mergeStyles({
          padding: '12px 12px 8px 12px'
        })}
      >
        <Stack>
          <Icon
            {...getFileTypeIconProps({
              extension: 'docx',
              size: 24,
              imageFileType: 'svg'
            })}
          />
        </Stack>
        <Stack
          className={mergeStyles({
            fontSize: '14px',
            fontWeight: '500'
          })}
        >
          {uploadedFile.file.name}
        </Stack>
        <Stack>
          <Icon iconName="ChromeClose" style={{ fontSize: '12px' }} />
        </Stack>
      </Stack>
      {!downloadable && <FileProgressBar uploadedFile={uploadedFile} />}
    </Stack>
  );
};
