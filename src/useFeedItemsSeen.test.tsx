import { renderHook, act } from '@testing-library/react-hooks';
import { useFeedItemsSeen } from './useFeedItemsSeen';

/**
 *  These are the unit tests for the example hook `useFeedItemsSeen`.
 *  It shows common cases as well as an edge case that may have been
 *  overlooked if tests weren't considered and written.
 */
describe('useFeedItemsSeen', () => {
  test('should handle setting number of seen items', async () => {
    const props = {
      numTotalItems: 10,
      onAllItemsSeen: jest.fn(() => {}),
    };
    const { result } = renderHook(() => useFeedItemsSeen(props));
    expect(result.current.numItemsSeen).toEqual(0);
    // Must wrap in await act to wait for any internal state updates to complete
    // If the call inside returns a promise, we can await this act call, and make the function
    // passed to `act` an async function as well.
    act(() => {
      result.current.setNumItemsSeen(1);
    });
    expect(result.current.numItemsSeen).toEqual(1);
    expect(result.current.allItemsSeen).toBeFalsy();
    expect(props.onAllItemsSeen).not.toHaveBeenCalled();
  });

  test('should trigger all items seen callback if setting to larger than total', async () => {
    const props = {
      numTotalItems: 10,
      onAllItemsSeen: jest.fn(() => {}),
    };
    const { result } = renderHook(() => useFeedItemsSeen(props));
    expect(result.current.numItemsSeen).toEqual(0);
    act(() => {
      result.current.setNumItemsSeen(1000);
    });
    expect(result.current.numItemsSeen).toEqual(1000);
    expect(result.current.allItemsSeen).toBeTruthy();
    expect(props.onAllItemsSeen).toHaveBeenCalled();
  });

  test('should trigger all items seen if total changes to below # seen', async () => {
    /**
     *  This test case is an example of behavior that is true, but maybe it's
     *  a weird edge case we don't want and should handle in the code.
     */
    let props = {
      numTotalItems: 10,
      onAllItemsSeen: jest.fn(() => {}),
    };
    const { result, rerender } = renderHook(() => useFeedItemsSeen(props));
    expect(result.current.numItemsSeen).toEqual(0);
    act(() => {
      result.current.setNumItemsSeen(5);
    });
    expect(result.current.numItemsSeen).toEqual(5);
    expect(result.current.allItemsSeen).toBeFalsy();
    expect(props.onAllItemsSeen).not.toHaveBeenCalled();

    // Now update the numTotalItems prop and re-render
    props.numTotalItems = 1;
    rerender();

    expect(result.current.numItemsSeen).toEqual(5);
    // Now we see perhaps weird behavior where `allItemsSeen` is true
    expect(result.current.allItemsSeen).toBeTruthy();
    // But this callback isn't called
    expect(props.onAllItemsSeen).not.toHaveBeenCalled();
  });
});
