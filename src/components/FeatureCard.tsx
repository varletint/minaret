import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient,
}: FeatureCardProps) {
  return (
    <Card className='overflow-hidden border-0 shadow-lg'>
      <CardContent
        className={`flex aspect-[4/3] flex-col items-center justify-center p-6 bg-gradient-to-br ${gradient} text-white`}>
        <Icon className='h-12 w-12 mb-4 opacity-90' />
        <h3 className='text-xl font-bold text-center'>{title}</h3>
        <p className='mt-2 text-sm text-center text-white/80'>{description}</p>
      </CardContent>
    </Card>
  );
}
