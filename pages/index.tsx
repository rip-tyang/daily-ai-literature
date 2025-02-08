import { useState, useEffect } from 'react';
import { today, CalendarDate } from '@internationalized/date';
import { Calendar } from '@heroui/calendar';

import { prompt, title } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { Post } from '@/types';
import { lightLayout } from '@heroui/theme';

const TIME_ZONE = 'America/New_York';

export default function DocsPage() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(
    today(TIME_ZONE)
  );
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    getPost(selectedDate.toString()).then(setPost);
  }, [selectedDate]);

  return (
    <DefaultLayout>
      <section className="flex flex-row flex-wrap md:flex-nowrap gap-20 py-10 md:py-12">
        {post ? (
          <div className="basis-auto">
            <p className={title()}>{post.Title}</p>
            <p className={prompt()}>Model: {post.Model}</p>
            <p className={prompt()}>
              <ul>Prompt: </ul>
              {post.Prompt.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </p>
            <article className="whitespace-pre-wrap">{post.Response}</article>
          </div>
        ) : (
          <></>
        )}
        <div className="basis-64">
          <Calendar
            className=""
            maxValue={today(TIME_ZONE)}
            minValue={new CalendarDate(2025, 2, 3)}
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
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
