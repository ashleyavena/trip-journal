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
  const [fileCount, setFileCount] = useState<number>(0); // Store the number of selected files

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFileCount(event.target.files.length); // Update the file count
    }
  };

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

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('../public/collage.jpg')" }}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4">
        <input type="hidden" name="tripId" value={tripId} />

        {/* Custom File Upload Button */}
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          {fileCount > 0 ? `${fileCount} files selected` : 'Select Photos'}

          <input
            required
            type="file"
            name="photos"
            accept=".png, .jpg, .jpeg, .gif"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <button className="bg-blue-600 text-white" type="submit">
          Upload
        </button>
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
