import * as React from 'react';

interface FeedItemsSeenInput {
  numTotalItems: number;
  numTotalItemsSeen: number; //why do we need this ?
  onAllItemsSeen: (setToRead: boolean) => void; // callback to call
  onAllItemUnSeen: (setToRead: boolean) => void;
}

interface FeedItemsSeenOutput {
  numItemsSeen: number;
  setNumItemsSeen: (num: number) => void;
  allItemsSeen: boolean;
}

/**
 *  Example of hook with encapsulated logic.
 *  This is the component specific logic that we'd want to test.
 */
export const useFeedItemsSeen = ({
  numTotalItems,
  numTotalItemsSeen,
  onAllItemsSeen,
  onAllItemUnSeen,
}: FeedItemsSeenInput): FeedItemsSeenOutput => {
  const [numItemsSeen, setNumItemsSeen] = React.useState<number>(numTotalItemsSeen);//not working, also do we really need useFeedItemsSeen ?

  // Set the internal state and call the callback if we've seen all items.
  // Internal logic we'd want to test.
  const setNumItemsSeenFn = React.useCallback(
    (num: number) => {
      setNumItemsSeen(num);
      if (num >= numTotalItems) {
        onAllItemsSeen(true);
      } else if (num === 0) {
        onAllItemUnSeen(false);
      }
    },
    [setNumItemsSeen, numTotalItems, onAllItemsSeen, onAllItemUnSeen],
  );

  return {
    numItemsSeen,
    setNumItemsSeen: setNumItemsSeenFn,
    allItemsSeen: numItemsSeen >= numTotalItems,
  };
};
