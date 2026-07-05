import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
}

export default function StarRating({ rating, onChange, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          id={`star-btn-${star}`}
          disabled={readOnly}
          onClick={() => onChange(star)}
          className={`p-1 transition-transform active:scale-95 ${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Star
            id={`star-icon-${star}`}
            className={`w-8 h-8 transition-colors ${
              star <= rating
                ? 'fill-amber-400 stroke-amber-500'
                : 'fill-slate-100 stroke-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
