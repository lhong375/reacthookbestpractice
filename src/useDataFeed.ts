import * as React from 'react';

export type FeedFilter = 'date' | 'rating' | 'read';

export type FeedItem = {
  id: string;
  contents: string;
  read: boolean;
};

interface DataFeedInput {
  userID: string;
  filter: FeedFilter;
}

interface DataFeedOutput {
  initialized: boolean;
  items: Array<FeedItem>;
  refresh: () => void;
  markRead: (feedId: string) => void;
  markAll: (setToRead: boolean) => void;
}

/**
 *  Example of hook with:
 *    - encapsulated state and logic
 *    - integration with 3rd party imperative class
 *
 *  In reality this file would probably live under a separate "feed" package
 *  and have it's own tests to thoroughly check it's behavior with a mock DataFeedClient.
 */
export const useDataFeed = ({
  userID,
  filter,
}: DataFeedInput): DataFeedOutput => {
  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [client, setClient] = React.useState<DataFeedClient | null>(null);
  const [items, setItems] = React.useState<Array<FeedItem>>([]);

  // Asynchronous initialization function using 3rd party client
  const initializeDataFeed = React.useCallback(async () => {
    const client = new DataFeedClient();
    await client.initialize();
    const fetchedItems = await client.getItems({ userID, filter });
    setItems(fetchedItems);
    setClient(client);
    setInitialized(true);
  }, [userID, filter, setItems, setClient, setInitialized]);

  // Initialization effect
  React.useEffect(() => {
    if (!initialized) {
      initializeDataFeed();
    }
  }, [initialized, initializeDataFeed]);

  // Returned function for internal logic
  const refresh = React.useCallback(async () => {
    if (!client) {
      return;
    }
    const fetchedItems = await client.getItems({ userID, filter });
    setItems(fetchedItems);
  }, [client, userID, filter, setItems]);

  const markAll = React.useCallback(async (setToRead: boolean) => {
    if (!client) {
      return;
    }
    const itemsUpdated = items.map( (item:FeedItem) => { return {...item, read: setToRead}; } );
    setItems(itemsUpdated);
  }, [client, userID, filter, setItems]);

  const markRead = React.useCallback(async (feedId) => {
    if (!client) {
      return;
    }
    console.log("markRead id="+feedId);
    let itemToMarkRead = items.find( (item:FeedItem) => item.id === feedId );
    if (itemToMarkRead) {
      itemToMarkRead.read = !itemToMarkRead.read;
      console.log("markRead id="+feedId, itemToMarkRead, items);
      setItems(items.slice());

    }
  }, [client, userID, filter, setItems]);

  return {
    initialized,
    items,
    refresh,
    markAll,
    markRead,
  };
};

// fake items for example
export const MOCK_FEED_ITEMS: Array<FeedItem> = [
  {
    id: '0',
    contents: 'feed_item_0',
    read: false,
  },
  {
    id: '1',
    contents: 'feed_item_1',
    read: false,
  },
];

/**
 *  Example of a 3rd party imperative class we want to integrate to get a data feed.
 *  This is something we would not unit test becase we assume the source we get it
 *  from will test it.
 */
class DataFeedClient {
  initialize = (): Promise<void> => {
    return Promise.resolve();
  };

  getItems = (_input: {
    userID: string;
    filter: FeedFilter;
  }): Promise<Array<FeedItem>> => {
    return Promise.resolve(MOCK_FEED_ITEMS);
  };
}
