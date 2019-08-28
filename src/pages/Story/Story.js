import React, { useContext, useMemo } from "react";
import { StoriesContext } from "../../dataProviders";
import find from "lodash/find";

const Story = () => {
  const stories = useContext(StoriesContext);
  const story = useMemo(() => {
    return find(stories, item => item.data.slug === params.slug);
  }, [stories, params.slug]);

  return (
    <div>
      <h2>Story page</h2>
    </div>
  );
};

export default Story;
