/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import { type FormEvent, useState } from 'react';

export type Image = {
  imageId: number;
  url: string;
  caption: string;
};

type UploadFormProps = {
  onUpload: (url: string) => void;
};

export function UploadForm({ onUpload }: UploadFormProps) {
  const [imageFile, setImageFile] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const req = {
        method: 'POST',
        body: formData,
      };
      const res = await fetch('/api/uploads', req);
      if (!res.ok) {
        throw new Error(`fetch error ${res.status}`);
      }
      const image = (await res.json()) as Image;
      console.log('image:', image);
      setImageFile(image.url); // added
      onUpload(image.url);
    } catch (error) {
      console.log('error message:', error);
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
          name="image"
          accept=".png, .jpg, .jpeg, .gif"
        />
        <button type="submit">Upload</button>
      </form>
      {imageFile && <img src={imageFile} alt="Uploaded preview" />}
    </div>
  );
}
