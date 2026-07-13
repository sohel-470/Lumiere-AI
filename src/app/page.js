import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Subscribe to my channel</h1>
      <Button variant="destructive" size="lg">Subscribe</Button>
    </div>
  );
}
