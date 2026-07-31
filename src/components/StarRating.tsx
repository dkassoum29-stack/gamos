import { IconStar } from "./icons";

export default function StarRating({
  note,
  className = "h-4 w-4",
}: {
  note: number;
  className?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${note} sur 5 étoiles`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <IconStar
          key={i}
          filled={i < note}
          className={`${className} ${i < note ? "text-amber-500" : "text-zinc-300"}`}
        />
      ))}
    </span>
  );
}
