// app/search/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FollowingMembers from '../components/FollowingMembers';
import SearchList from '../components/SearchList';
import { useStore } from '../store/useStore';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState([]);
  const { user } = useStore();

 

  return (
    <div className='flex'>
        <div className='sticky md:block hidden'>
        <FollowingMembers/>
        </div>
        
        <SearchList name={query}/>
      </div>
  );
};

export default SearchResults;
