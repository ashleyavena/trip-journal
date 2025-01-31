import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';

export type Image = {
  imageId: number;
  url: string;
  caption: string;
};

type UploadFormProps = {
  tripId: string;
  onUpload: (urls: string[]) => void;
};

export function UploadForm({ tripId, onUpload }: UploadFormProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]); // To store selected files
  const [imageUrls, setImageUrls] = useState<string[]>([]); // To store uploaded image URLs
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files)); // Convert FileList to array
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Resize each selected file before appending it to the FormData
    const resizedFiles = await Promise.all(
      imageFiles.map(
        (file) =>
          new Promise<File>((resolve) => {
            Resizer.imageFileResizer(
              file,
              200, // max width
              200, // max height
              'JPEG', // output type
              90, // quality (1-100)
              0, // rotation (optional)
              (uri) => {
                const resizedFile = uri as File; // Convert base64 to File object
                resolve(resizedFile);
              },
              'file' // output type as file
            );
          })
      )
    );

    // Append resized files to FormData
    resizedFiles.forEach((file) => {
      formData.append('photos', file); // Append each resized file
    });
    formData.append('tripId', tripId);

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

      // Collect URLs of uploaded images
      const uploadedUrls = images.map((image) => image.url);
      setImageUrls(uploadedUrls); // Store the URLs
      onUpload(uploadedUrls); // Pass the URLs to the parent component

      navigate('/trips'); // Redirect to trips after successful upload
    } catch (error) {
      console.log('Error message:', error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Caption:
          <input required autoFocus type="text" id="caption" name="caption" />
        </label>
        <br />
        <input
          required
          type="file"
          name="photos" // The name should match the backend field name
          accept=".png, .jpg, .jpeg, .gif"
          multiple // Allows selecting multiple files
          onChange={handleFileChange}
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
