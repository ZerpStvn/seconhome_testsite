import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

const NotesListCard = ({ note }) => {
  const noteLength = note.split(" ").length;
  const [truncateNote, setTruncateNote] = React.useState(
    noteLength > 12 ? true : false
  );
  function getContent() {
    if (truncateNote) {
      return (
        note
          .split(" ")
          .splice(0, 12)
          .join(" ") + "..."
      );
    }
    return note;
  }
  const content = getContent();

  const toggleTruncate = () => {
    let toggle = !truncateNote;
    setTruncateNote(toggle);
  };

  return (
    <div
      className={truncateNote ? "notes-content" : ""}
      onClick={truncateNote ? toggleTruncate : null}
    >
      {noteLength > 12 && !truncateNote ? (
        <span className="note-expand-close" onClick={toggleTruncate}>
          <CloseCircleOutlined />
        </span>
      ) : null}

      {content}
    </div>
  );
};

export default NotesListCard;
