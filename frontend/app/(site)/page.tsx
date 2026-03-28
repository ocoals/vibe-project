import { CreateEventForm } from "@/components/create-event-form";
import { HomeHero } from "@/components/home-hero";

export default function Home() {
  return (
    <HomeHero>
      <CreateEventForm />
    </HomeHero>
  );
}
