import { useParams } from 'react-router-dom';
import { RealTimeFlowEditor } from './RealTimeFlowEditor';

export function FlowEditorRoute() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Flow ID is required</div>;
  }
  
  return <RealTimeFlowEditor flowId={id} />;
}