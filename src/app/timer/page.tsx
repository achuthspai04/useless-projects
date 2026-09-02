import type { Metadata } from "next";
import TimerApp from "./timer-app";

export const metadata: Metadata = {
  title: "Timer · Useless Projects",
  description: "Set a build timer - the lego board fills in as the clock runs down.",
};

export default function TimerPage() {
  return <TimerApp />;
}
