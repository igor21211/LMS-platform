'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

export const CourseEnrollButton = ({
  courseId,
  price,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/courses/${courseId}/checkout`
      );
      window.location.assign(response.data.url);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
