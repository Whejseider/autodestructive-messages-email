import MessageView from '@/components/MessageView';

export default function MessagePage({ params }: { params: { id: string } }) {
  return <MessageView id={params.id} />;
}