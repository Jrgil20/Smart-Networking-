import React from 'react';

interface ReputationBadgeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeConfig = {
  sm: { container: 'w-14 h-14', text: 'text-lg', stroke: 3, radius: 22, label: 'text-[10px]' },
  md: { container: 'w-24 h-24', text: 'text-2xl', stroke: 4, radius: 38, label: 'text-xs' },
  lg: { container: 'w-32 h-32', text: 'text-3xl', stroke: 5, radius: 52, label: 'text-sm' },
};

const ReputationBadge: React.FC<ReputationBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  // Color based on score
  const getColor = () => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-accent';
    if (score >= 40) return 'text-muted-foreground';
    return 'text-destructive';
  };

  const getStrokeColor = () => {
    if (score >= 80) return 'stroke-primary';
    if (score >= 60) return 'stroke-accent';
    if (score >= 40) return 'stroke-muted-foreground';
    return 'stroke-destructive';
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`${config.container} relative flex items-center justify-center`}>
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={config.radius}
            fill="none"
            className="stroke-border"
            strokeWidth={config.stroke}
          />
          <circle
            cx="50%"
            cy="50%"
            r={config.radius}
            fill="none"
            className={`${getStrokeColor()} transition-all duration-1000 ease-out`}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className={`font-display font-bold ${config.text} ${getColor()}`}>
          {score}
        </span>
      </div>
      {showLabel && (
        <span className={`${config.label} text-muted-foreground font-medium uppercase tracking-wider`}>
          Reputation
        </span>
      )}
    </div>
  );
};

export default ReputationBadge;