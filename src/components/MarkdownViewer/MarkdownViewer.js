import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import axios from "axios";

export default function MarkdownViewer({ url, fullHeight }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get(url).then(response => {
      setContent(response.data);
    });
  }, [url]);

  return (
    <div className="row pt-3" style={{ height: fullHeight ? "100%" : "250px" }}>
      <div className="col-8 offset-2 h-100 overflow-auto px-5 pt-3 bg-white">
        {content && <Markdown>{content}</Markdown>}
      </div>
    </div>
  );
}
