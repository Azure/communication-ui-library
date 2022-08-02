import {
  CameraButton,
  ControlBar,
  ControlBarButton,
  DevicesButton,
  EndCallButton,
  MicrophoneButton,
  ParticipantsButton,
  ScreenShareButton
} from '@azure/communication-react';
import { Checkbox, Icon, IStyle, mergeStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import React from 'react';
import { GLOBAL } from '../dataStore';

export type ChoiceOptions =
  | 'CameraButton'
  | 'DevicesButton'
  | 'MicrophoneButton'
  | 'ParticipantsButton'
  | 'ScreenShareButton';

export type Choices = Partial<Record<ChoiceOptions, boolean>>;

export const ControlBarButtons = (props: { onContinue: () => void }) => {
  const theme = useTheme();
  const [choice, setChoice] = React.useState<Choices>({});
  const [isLabeled, setIsLabeled] = React.useState(GLOBAL.controlBarButtonsLabeled);

  React.useEffect(() => {
    GLOBAL.controlBarButtonsLabeled = isLabeled;
    GLOBAL.controlBarButtons = Object.keys(choice).filter((key) => choice[key as ChoiceOptions]);
  }, [choice, isLabeled]);

  const isActive = (value: ChoiceOptions) => choice[value];

  const optionTabStyles = (choice: ChoiceOptions) => {
    return {
      border: `1px solid ${isActive(choice) ? theme.palette.themePrimary : theme.palette.neutralLight}`,
      borderRadius: theme.effects.roundedCorner6,
      background: theme.palette.white,
      cursor: 'pointer',
      fontWeight: isActive(choice) ? '600' : '400',
      ':hover': {
        background: theme.palette.neutralLighter,
        overflow: 'hidden'
      }
    };
  };

  const previewAreaStyles: IStyle = {
    minWidth: '50%',
    minHeight: '500px',
    height: 'auto',
    border: `1px solid ${theme.palette.neutralLight}`,
    background: theme.palette.white,
    borderRadius: theme.effects.roundedCorner6,
    position: 'relative'
  };

  return (
    <Stack
      style={{
        textAlign: 'left',
        padding: '4rem'
      }}
    >
      <h1 style={{ fontWeight: 400, fontSize: '2rem', margin: 0, padding: 0 }}>Choose Control Bar Buttons</h1>
      <Stack horizontal style={{ marginTop: '2rem' }}>
        <Stack style={{ width: '30%', marginRight: '1rem' }}>
          <Checkbox label="Labeled" checked={isLabeled} onChange={() => setIsLabeled(!isLabeled)} />
          <br />
          <Stack horizontal tokens={{ childrenGap: '1rem' }}>
            <Stack
              className={mergeStyles(optionTabStyles('MicrophoneButton'))}
              onClick={() => setChoice({ ...choice, MicrophoneButton: !choice.MicrophoneButton })}
            >
              <MicrophoneButton />
            </Stack>
            <Stack
              className={mergeStyles(optionTabStyles('CameraButton'))}
              onClick={() => setChoice({ ...choice, CameraButton: !choice.CameraButton })}
            >
              <CameraButton />
            </Stack>
            <Stack
              className={mergeStyles(optionTabStyles('ScreenShareButton'))}
              onClick={() => setChoice({ ...choice, ScreenShareButton: !choice.ScreenShareButton })}
            >
              <ScreenShareButton />
            </Stack>
          </Stack>
          <br />
          <Stack horizontal tokens={{ childrenGap: '1rem' }}>
            <Stack
              className={mergeStyles(optionTabStyles('DevicesButton'))}
              onClick={() => setChoice({ ...choice, DevicesButton: !choice.DevicesButton })}
            >
              <DevicesButton />
            </Stack>
            <Stack
              className={mergeStyles(optionTabStyles('ParticipantsButton'))}
              onClick={() => setChoice({ ...choice, ParticipantsButton: !choice.ParticipantsButton })}
            >
              <ControlBarButton onRenderOffIcon={() => <Icon iconName="ControlButtonParticipants" />} />
            </Stack>
          </Stack>
        </Stack>
        <Stack style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Stack className={mergeStyles(previewAreaStyles)}>
            <ControlBar layout={GLOBAL.controlBarLayout}>
              {isActive('MicrophoneButton') && <MicrophoneButton showLabel={isLabeled} />}
              {isActive('CameraButton') && <CameraButton showLabel={isLabeled} />}
              {isActive('ScreenShareButton') && <ScreenShareButton showLabel={isLabeled} />}
              {isActive('DevicesButton') && <DevicesButton showLabel={isLabeled} />}
              {isActive('ParticipantsButton') && <ParticipantsButton participants={{} as any} showLabel={isLabeled} />}
              <EndCallButton showLabel={isLabeled} />
            </ControlBar>
          </Stack>
          <br />
          <Stack style={{ width: '100%', alignItems: 'end' }}>
            <PrimaryButton style={{ width: '300px' }} onClick={() => props.onContinue()}>
              Continue
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
