interface StatusProps {
  value: boolean;
  labels?: { trueLabel: string; falseLabel: string };
}
const Status = (props: StatusProps) => {
  const { value, labels } = props;
  const className = value
    ? 'text-primary border border-primary/50 bg-primary/10'
    : 'text-destructive border border-destructive/50 bg-destructive/10';

  return (
    <div className={`py-0.5 px-2 border rounded-2xl ${className}`}>
      {value ? labels?.trueLabel || '启用' : labels?.falseLabel || '禁用'}
    </div>
  );
};

export default Status;
