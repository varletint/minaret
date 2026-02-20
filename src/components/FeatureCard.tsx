import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface FeatureCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  gradient?: string;
  image?: string;
  sponsorText?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient,
  image,
  sponsorText,
}: FeatureCardProps) {
  if (image) {
    return (
      <Card className='overflow-hidden border-0 shadow-lg h-full relative aspect-[4/3] flex flex-col group'>
        <div className='relative flex-1 bg-white overflow-hidden p-2'>
          <img
            src={image}
            className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-105'
            alt='Sponsor'
          />
        </div>
        {sponsorText && (
          <div className='bg-emerald-800 p-2 text-center text-xs md:text-sm font-medium text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] relative z-10 w-full'>
            {sponsorText}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden border-0 shadow-lg h-full'>
      <CardContent
        className={`flex aspect-[4/3] flex-col items-center justify-center p-6 bg-gradient-to-br ${gradient} text-white h-full`}>
        {Icon && <Icon className='h-12 w-12 mb-4 opacity-90' />}
        {title && <h3 className='text-xl font-bold text-center'>{title}</h3>}
        {description && (
          <p className='mt-2 text-sm text-center text-white/80'>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
