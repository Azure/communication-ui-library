import { SingleElementEvent } from '../src/SingleElementEvent';

export default {
  title: 'Example/Slot/List/SingleElementEvent(alternative to MultipleListElement)',
  component: SingleElementEvent
};

const Template = (args: any) => <SingleElementEvent />;

export const Default: any = Template.bind({});

Default.parameters = {
  docs: {
    source: {
      code: `
const [children, setChildren] = useState<React.ReactElement[]>([]);
  return (
    <CustomAvatarAndSlotReact
      onUserjoined={(e) => { setChildren((children) => [...(children ?? []), <div key={e.detail?.data.userId}>{e.detail?.data.userId}</div>]) }}
      onUserleft={(e) => { setChildren(
        (children) => { return children?.filter(element => element.key !== e.detail?.user ) }) 
      }}
    > 
      {children}
    </CustomAvatarAndSlotReact>
  );`,
      language: 'typescript',
      type: 'auto'
    }
  }
};
