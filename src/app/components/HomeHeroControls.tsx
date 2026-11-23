"use client";

import CalBookingButton from "./CalBookingButton";
import SiteNav from "./SiteNav";
import { MagneticButton } from "./motion-brew/magnetic-button";

export function HomeSiteNav() {
  return <SiteNav />;
}

function MagneticBookingAction({ onClick }: { onClick: () => void }) {
  return (
    <MagneticButton type="button" size="sm" strength={0.18} labelStrength={0.08} className="hero-action hero-action-primary" onClick={onClick}>
      Book a Discovery Call
    </MagneticButton>
  );
}

export function HeroBookingButton() {
  return <CalBookingButton className="hero-booking" BookingAction={MagneticBookingAction} />;
}
