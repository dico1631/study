'use client';
import { useState } from 'react';

export default function Home() {
  const [hello, setHello] = useState('');

  const fetchHello = async () => {
    const response = await fetch('/api/hello');
    if (response.ok) {
      const text = await response.text();
      setHello(text);
    } else {
      setHello('Error fetching hello');
    }
  };

  return(
    <>
    <div>메인페이지 {hello}</div>
    <button type="submit" formMethod="get" onClick={fetchHello} >hello 부르기</button>
    </>
  );
}