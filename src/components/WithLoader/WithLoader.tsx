import { Loader } from '../Loader/Loader';

export type WithLoaderProps = React.PropsWithChildren<{
  loading: boolean;
}>;

export const WithLoader: React.FC<WithLoaderProps> = ({
  loading = true,
  ...props
}) => {
  if (loading) {
    return (
      <div>
        <Loader loading />
        {props.children}
      </div>
    );
  }
  return <div>{props.children}</div>;
};
