import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { today, getLocalTimeZone } from '@internationalized/date';

export default function DocsPage() {
  const router = useRouter();

  useEffect(() => {
    const dateStr = today(getLocalTimeZone()).toString();
    router.replace(`/${dateStr}`);
  }, []);

  return <>redirecting ...</>;
}
