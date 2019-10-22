import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import axios from "axios";

export default function MarkdownViewer({ url }) {
  console.log("r", url);
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get(url).then(response => {
      setContent(response.data);
    });
  }, [url]);

  return (
    <div className="h-100">{content && <Markdown>{content}</Markdown>}</div>
  );
}
