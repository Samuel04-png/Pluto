import { cn } from "@/lib/utils/cn";
import type { Contact } from "@/types";

const sizes = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-24 w-24 text-2xl"
};

export function ContactAvatar({
  contact,
  size = "md",
  className
}: {
  contact: Contact;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const initials = contact.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full font-bold shadow-sm ring-1 ring-white/80",
        sizes[size],
        contact.avatarUrl ? "bg-white" : contact.color,
        className
      )}
    >
      {contact.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" src={contact.avatarUrl} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
