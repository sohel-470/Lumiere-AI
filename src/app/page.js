import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Subscribe to my channel</h1>
      <Button variant="destructive">Subscribe</Button>
      <UserButton/>
    </div>
  );
}
