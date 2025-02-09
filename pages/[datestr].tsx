import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  today,
  getLocalTimeZone,
  parseDate,
  CalendarDate,
} from '@internationalized/date';
import { Calendar } from '@heroui/calendar';

import { prompt, title } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { Post } from '@/types';

export default function PostPage() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>();
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setSelectedDate(parseDate(router.query.datestr as string));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (selectedDate) {
      getPost(selectedDate.toString()).then(setPost);
    }
  }, [selectedDate]);

  return (
    <DefaultLayout>
      {post ? (
        <section className="flex flex-row flex-wrap md:flex-nowrap gap-20 py-10 md:py-12">
          <div className="basis-auto">
            <p className={title()}>{post.Title}</p>
            <p className={prompt()}>Model: {post.Model}</p>
            <div className={prompt()}>
              <ul>Prompt: </ul>
              {post.Prompt.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </div>
            <article className="whitespace-pre-wrap">{post.Response}</article>
          </div>
          <div className="basis-64">
            <Calendar
              className=""
              maxValue={today(getLocalTimeZone())}
              minValue={new CalendarDate(2025, 2, 3)}
              value={selectedDate}
              onChange={(newDate) => {
                router.push(`/${newDate.toString()}`);
                setSelectedDate(newDate);
              }}
            />
          </div>
        </section>
      ) : (
        <></>
      )}
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
