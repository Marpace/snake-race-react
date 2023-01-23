import {useEffect} from "react";

function useKeyDown(callback, keys) {

  const onKeyDown = (e) => {
    const keyWasPressed = keys.some((key) => e.key === key);
    if (keyWasPressed) {
      e.preventDefault();
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};


export default useKeyDown;