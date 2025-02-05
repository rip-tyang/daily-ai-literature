import { useState, useEffect } from 'react';
import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { Calendar } from '@heroui/calendar';

import { prompt, title } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { Post } from '@/types';

export default function DocsPage() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(
    today(getLocalTimeZone())
  );
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    getPost(selectedDate.toString()).then(setPost);
  }, [selectedDate]);

  const articleSection = post ? (
    <>
      <p className={prompt()}>Model: {post.Model}</p>
      <p className={prompt()}>Prompt: {post.Prompt}</p>
      <article className="whitespace-pre-wrap">{post.Response}</article>
    </>
  ) : (
    <></>
  );

  return (
    <DefaultLayout>
      <section className="flex flex-row gap-20 py-10 md:py-12">
        <div className="basis-64">
          <Calendar
            className=""
            maxValue={today(getLocalTimeZone())}
            minValue={new CalendarDate(2025, 2, 3)}
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
        <div className="basis-auto">{articleSection}</div>
      </section>
    </DefaultLayout>
  );
}

const getPost = async (date: string): Promise<Post | null> => {
  const response = await fetch(`/api/post/${date}`);

  if (response.status == 200) {
    return response.json();
  }

  return null;
};
