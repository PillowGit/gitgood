import { Card } from "@/components/ui/Card";

export default function FeaturedProblems() {
  return (
    <div className="mt-4">
      <h2 className="text-xl mb-4">Featured Problems</h2>
      <div className="grid grid-cols-3 gap-4">
        <Card className="h-32">Two Sum</Card>
        <Card className="h-32">Pillow's Quest</Card>
        <Card className="h-32">Pillow's Quest Two</Card>
      </div>
    </div>
  );
}
