import { useEffect, useRef, useState, type DragEvent } from "react";
import { cx } from "../lib/format";
import { CloseIcon, UploadIcon } from "./Icons";

export type UploadedImage = { id: string; file: File; url: string; progress: number };

/** Click-or-drop image uploader with previews and simulated upload progress. */
export function ImageUpload({
  id,
  images,
  onChange,
  maxFiles = 3,
  maxMb = 10,
  onError,
}: {
  id: string;
  images: UploadedImage[];
  onChange: (next: UploadedImage[] | ((prev: UploadedImage[]) => UploadedImage[])) => void;
  maxFiles?: number;
  maxMb?: number;
  onError?: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearInterval), []);

  const add = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const valid = incoming.filter(
      (f) => f.type.startsWith("image/") && f.size <= maxMb * 1024 * 1024,
    );
    const room = Math.max(0, maxFiles - images.length);
    const accepted = valid.slice(0, room).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      url: URL.createObjectURL(file),
      progress: 0,
    }));
    if (valid.length < incoming.length) onError?.(`Please upload image files under ${maxMb}MB.`);
    else if (valid.length > room) onError?.(`You can upload up to ${maxFiles} images.`);
    else onError?.("");
    if (!accepted.length) return;
    onChange((prev) => [...prev, ...accepted]);
    accepted.forEach((img) => {
      let p = 0;
      const t = window.setInterval(() => {
        p = Math.min(100, p + 20 + Math.random() * 25);
        onChange((prev) => prev.map((x) => (x.id === img.id ? { ...x, progress: p } : x)));
        if (p >= 100) clearInterval(t);
      }, 160);
      timers.current.push(t);
    });
  };

  const remove = (imgId: string) =>
    onChange((prev) => {
      const target = prev.find((x) => x.id === imgId);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((x) => x.id !== imgId);
    });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    add(e.dataTransfer.files);
  };

  const full = images.length >= maxFiles;

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        className="sr-only"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <figure
            key={img.id}
            className="group relative h-28 w-28 animate-fade-in overflow-hidden bg-stone"
          >
            <img src={img.url} alt={img.file.name} className="h-full w-full object-cover" />
            {img.progress < 100 ? (
              <div className="absolute inset-0 flex items-end bg-ink/25">
                <div className="h-1 w-full bg-ivory/60">
                  <div
                    className="h-full bg-ink transition-all"
                    style={{ width: `${img.progress}%` }}
                  />
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => remove(img.id)}
              aria-label={`Remove ${img.file.name}`}
              className="absolute right-1.5 top-1.5 cursor-pointer bg-ivory/90 p-1 transition-colors hover:bg-ivory"
            >
              <CloseIcon size={12} />
            </button>
            <figcaption className="sr-only">{img.file.name}</figcaption>
          </figure>
        ))}

        {!full ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={cx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed text-center transition-colors",
              images.length ? "h-28 w-28 px-2" : "min-h-[148px] w-full px-6 py-8",
              drag ? "border-ink bg-ivory" : "border-taupe bg-white hover:border-ink",
            )}
          >
            <UploadIcon size={images.length ? 18 : 24} />
            {images.length ? (
              <span className="text-[11px] text-muted">Add image</span>
            ) : (
              <>
                <span className="text-[14px]">
                  Click to upload <span className="text-muted">or drag an image here</span>
                </span>
                <span className="text-[12px] text-muted">
                  JPG, PNG or HEIC · Up to {maxFiles} images · Max {maxMb}MB each
                </span>
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
