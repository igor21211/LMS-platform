'use client';

import { Chapter } from '@/lib/generated/prisma/client';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvidedDragHandleProps,
  DropResult,
} from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface ChaptersListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
}

export const ChapterList = ({
  items,
  onEdit,
  onReorder,
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      const items = Array.from(chapters);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const startIndex = Math.min(source.index, destination.index);
      const endIndex = Math.max(source.index, destination.index);

      const updatedChapters = items.slice(startIndex, endIndex + 1);
      setChapters(items);

      const bulkUpdateData = updatedChapters.map((chapter) => ({
        id: chapter.id,
        position: items.findIndex((item) => item.id === chapter.id),
      }));

      onReorder(bulkUpdateData);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 borser text-slate-700 rounded-md mb-4 text-sm',
                      index === chapters.length - 1 && 'mb-20',
                      chapter.isPublished &&
                        'bg-sky-100 border-sky-200 text-sky-700'
                    )}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <ChapterItem
                      chapter={chapter}
                      dragHandleProps={provided.dragHandleProps}
                      onEdit={onEdit}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;

const ChapterItem = ({
  chapter,
  dragHandleProps,
  onEdit,
}: {
  chapter: Chapter;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  onEdit: (id: string) => void;
}) => {
  return (
    <>
      <div
        className={cn(
          'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
          chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200'
        )}
        {...dragHandleProps}
      >
        <Grip className="h-4 w-4  text-slate-500" />
      </div>
      {chapter.title}
      <div className=" ml-auto pr-2 flex items-center gap-x-2">
        {chapter.isFree && <Badge>Free</Badge>}
        <Badge
          className={cn(
            'bg-slate-500 text-white',
            chapter.isPublished && 'bg-sky-700'
          )}
        >
          {chapter.isPublished ? 'Published' : 'Draft'}
        </Badge>
        <Pencil
          className="h-4 w-4 cursor-pointer hover:opacity-75 transition"
          onClick={() => onEdit(chapter.id)}
        />
      </div>
    </>
  );
};
