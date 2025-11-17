import MessageView from '@/components/MessageView';

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MessageView id={id} />;
}
