type StatusTagProps = {
  text: string;
};

function StatusTag({ text }: StatusTagProps) {
  return <span className="status-tag">{text}</span>;
}

export default StatusTag;