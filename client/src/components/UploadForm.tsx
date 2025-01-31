import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type Image = {
  imageId: number;
  url: string;
  caption: string;
};

type UploadFormProps = {
  tripId: string;
};

export function UploadForm({ tripId }: UploadFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]); // store uploaded image URLs
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const req = {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      };

      const res = await fetch('/api/uploads', req);
      if (!res.ok) {
        throw new Error(`Fetch error ${res.status}`);
      }

      const images = (await res.json()) as Image[];

      const uploadedUrls = images.map((image) => image.url);
      setImageUrls((prev) => [...new Set([...prev, ...uploadedUrls])]);

      navigate('/trips');
    } catch (error) {
      console.log('Error message:', error);
    }
  }
  //   // formData.append('tripId', tripId); = <input type="hidden" name="tripId" value={tripId} />
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Caption:
          <input required autoFocus type="text" id="caption" name="caption" />
        </label>
        <br />
        <input type="hidden" name="tripId" value={tripId} />
        <input
          required
          type="file"
          name="photos" //  name should match the backend field name
          accept=".png, .jpg, .jpeg, .gif"
          multiple
        />
        <button type="submit">Upload</button>
      </form>

      {imageUrls.length > 0 && (
        <div>
          <h3>Uploaded Images:</h3>
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Uploaded preview ${index}`}
              width="100"
            />
          ))}
        </div>
      )}
    </div>
  );
}
