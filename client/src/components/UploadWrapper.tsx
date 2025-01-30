import { useParams } from 'react-router-dom';
import { UploadForm } from './UploadForm';

export function UploadWrapper() {
  const { tripId } = useParams(); // Extract tripId from URL

  if (!tripId) {
    return <p>Error: Trip ID is missing</p>;
  }

  return (
    <UploadForm
      tripId={tripId}
      onUpload={(url) => console.log('Uploaded:', url)}
    />
  );
}
