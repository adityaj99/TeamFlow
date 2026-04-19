import { useIsFetching } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const TopLoader = () => {
  const isFetching = useIsFetching();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;

    if (isFetching) {
      timer = setTimeout(() => setShow(true), 200);
    } else {
      setShow(false);
    }

    return clearTimeout(timer);
  }, [isFetching]);

  return isFetching ? (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div className="h-full bg-blue-400 animate-progress-bar" />
    </div>
  ) : null;
};

export default TopLoader;
