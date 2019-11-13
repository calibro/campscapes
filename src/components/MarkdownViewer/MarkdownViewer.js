import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import classNames from "classnames";
import axios from "axios";

export default function MarkdownViewer({ url, fullHeight }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    axios.get(url).then(response => {
      setContent(response.data);
    });
  }, [url]);

  return (
    <div className="container h-100">
      <div
        className="row pt-3"
        style={{ height: fullHeight ? "100%" : "250px" }}
      >
        <div
          className={`h-100 ${
            fullHeight ? "col-8 offset-2" : "col-12 offset-0"
          }`}
        >
          {content && (
            <div className="h-100 overflow-auto px-3 pt-3 bg-white">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
