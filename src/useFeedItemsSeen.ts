import * as React from 'react';

interface FeedItemsSeenInput {
  numTotalItems: number;
  onAllItemsSeen: () => void; // callback to call
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
  onAllItemsSeen,
}: FeedItemsSeenInput): FeedItemsSeenOutput => {
  const [numItemsSeen, setNumItemsSeen] = React.useState<number>(0);

  // Set the internal state and call the callback if we've seen all items.
  // Internal logic we'd want to test.
  const setNumItemsSeenFn = React.useCallback(
    (num: number) => {
      setNumItemsSeen(num);
      if (num >= numTotalItems) {
        onAllItemsSeen();
      }
    },
    [setNumItemsSeen, numTotalItems, onAllItemsSeen],
  );

  return {
    numItemsSeen,
    setNumItemsSeen: setNumItemsSeenFn,
    allItemsSeen: numItemsSeen >= numTotalItems,
  };
};
