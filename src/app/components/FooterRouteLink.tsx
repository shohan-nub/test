"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type FooterRouteLinkProps = Pick<ComponentProps<typeof Link>, "children" | "className" | "aria-label"> & {
  href: string;
};

export default function FooterRouteLink({ href, ...props }: FooterRouteLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function warmRoute() {
    if (href !== pathname) router.prefetch(href);
  }

  return <Link
    {...props}
    href={href}
    prefetch={false}
    onPointerEnter={event => { if (event.pointerType === "mouse") warmRoute(); }}
    onFocus={event => { if (event.currentTarget.matches(":focus-visible")) warmRoute(); }}
  />;
}
