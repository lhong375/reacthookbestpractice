import * as React from 'react';
import { useUser, User } from './useUser';
import { useDataFeed, FeedFilter, FeedItem } from './useDataFeed';
import { useFeedItemsSeen } from './useFeedItemsSeen';

interface Props {
  userID: string;
  filter: FeedFilter;
}

/**
 *  Example component following guideline patterns.
 */
export const UserFeed = ({ userID, filter }: Props) => {
  // Section 1: Dependency gathering
  // This example gets a user and a related feed data
  const { user } = useUser({ id: userID });
  const { items, refresh, markRead, markAll } = useDataFeed({ userID, filter });

  // Section 2: Component specific state and logic
  // This hook encapsulates stateful logic related to the user seeing the items.
  // This is the hook that we'd want to test.
  const { setNumItemsSeen, allItemsSeen, numItemsSeen } = useFeedItemsSeen({
    numTotalItems: items.length,
    numTotalItemsSeen: items.filter((item) => item.read).length,
    onAllItemsSeen: markAll,
    onAllItemUnSeen: markAll,
  });

  // Section 3: Presentational output
  // Makes use of all the data and logic from first 2 sections
  return (
    <UserFeedPresentational
      user={user}
      items={items}
      refresh={refresh}
      setNumItemsSeen={setNumItemsSeen}
      allItemsSeen={allItemsSeen}
      numItemsSeen={items.filter((item) => item.read).length}
      markRead={markRead}
    />
  );
};

/**
 *  Contrived example of a presentational component.
 *  Doesn't make use of all the props, but you can imagine it would.
 */
interface PresentationalProps {
  user: User | null;
  items: Array<FeedItem>;
  refresh: () => void;
  setNumItemsSeen: (num: number) => void;
  allItemsSeen: boolean;
  numItemsSeen: number;
  markRead: (feedId: string) => void;
}

const UserFeedPresentational = ({ user, items, allItemsSeen, numItemsSeen, setNumItemsSeen, markRead }: PresentationalProps) => {
  if (!user) {
    return null;
  }
  console.log("UserFeedPresentational allItemsSeen?", allItemsSeen, " items=", items);
  return (
    <div>
      <h1>{user.name}'s feed</h1>
      <button onClick={() => setNumItemsSeen(allItemsSeen ? 0 : items.length)}>
        {allItemsSeen ? 'UNREAD ALL' : 'MARK ALL READ'}
      </button>
      <div>numItemsSeen:{numItemsSeen}</div>
      {items.map((item) => (
        <div>
        #{item.id} - {item.contents} - {item.read?'READ':'UNREAD'}
        <button onClick={() => markRead(item.id)}>
          {item.read ? 'UNREAD' : 'MARK READ'}
        </button>
        </div>
      ))}
    </div>
  );
};
